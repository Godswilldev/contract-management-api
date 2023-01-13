import "dotenv/config";
import * as AWS from "aws-sdk";
import * as moment from "moment";
import { Repository } from "typeorm";
import { Guard } from "src/utils/guard";
import { InjectRepository } from "@nestjs/typeorm";
import { Contract } from "src/contract/models/contract.entity";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ClauseTemplates } from "src/clause/models/clauseFiles.entity";
import { ContractType } from "src/contractType/models/contractType.entity";
import { ResponseManager, StandardResponse } from "src/utils/responseManager";
import { ContractQuery, CreateContractDto } from "src/contract/dtos/contract.dto";
import { BusinessPartner } from "src/business-partners/entities/business-partner.entity";
const {
  AWS_S3_SECRET: secretAccessKey,
  AWS_S3_ACCESS_KEY: accessKeyId,
  AWS_S3_BUCKET_NAME: bucketName,
  AWS_S3_REGION: region,
} = process.env;

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(Contract) private readonly contractRepository: Repository<Contract>,
    @InjectRepository(BusinessPartner)
    private readonly business_partnerRepository: Repository<BusinessPartner>,
    @InjectRepository(ClauseTemplates)
    private readonly clauseTemplatesRepository: Repository<ClauseTemplates>,
    @InjectRepository(ContractType)
    private readonly contractTypeRepository: Repository<ContractType>,
  ) {}

  async GetAllContractsByAccountId(accountId: number, queryDto: ContractQuery) {
    const queryObj = { ...queryDto };

    delete queryObj["status"];

    let status = queryDto?.status?.split("&");

    let contracts = [];

    if (status) {
      // Filter by one or more status
      contracts = await this.contractRepository.find({
        take: queryObj.take || 10,
        skip: queryObj.take * (queryObj.page - 1) || 0,

        where: [
          {
            accountId,
            // @ts-ignore
            status: status[0],
          },
          // {
          //   accountId,
          //   // @ts-ignore
          //   status: status[1],
          // },
          // {
          //   accountId,
          //   // @ts-ignore
          //   status: status[2],
          // },
        ],
      });
    } else {
      contracts = await this.contractRepository.find({
        take: queryObj.take || 10,
        skip: queryObj.take * (queryObj.page - 1) || 0,
        where: { accountId },
      });
    }

    return ResponseManager.StandardResponse(
      "success",
      200,
      `${contracts.length} Contracts found`,
      contracts,
    );
  }

  async Get(accountId: number, contractId: number): Promise<StandardResponse<Contract>> {
    const contract = await this.contractRepository.findOne({
      where: { id: contractId, accountId },
      relations: [
        "business_partner",
        "contractType",
        "comments",
        "components",
        "addendums",
        "clauseTemplates",
        "additionalFields",
      ],
    });

    Guard.AgainstNullOrUndefined(contract, "contract");

    return ResponseManager.StandardResponse("success", 200, "Contract found", contract);
  }

  async Create(
    req: any,
    contractCreationDto: CreateContractDto,
  ): Promise<StandardResponse<Contract>> {
    const contractType = await this.contractTypeRepository.findOne({
      where: { id: contractCreationDto.contractTypeId, accountId: Number(req.account_id) },
    });

    Guard.AgainstNullOrUndefined(contractType, "contract Type");

    const con = this.contractRepository.create({
      ...contractCreationDto,
      contractType,
      accountId: Number(req.account_id),
      createdById: Number(req.account_id),
      modifiedById: Number(req.account_id),
    });

    const contract = await this.contractRepository.save(con);

    // const componentsToSave = this.componentRepository.create(contractCreationDto.components);

    // const components = await this.componentRepository.save(componentsToSave);

    // contract.components = components;

    // await this.contractRepository.save(contract);

    return ResponseManager.StandardResponse("success", 201, "Contract Created", contract);
  }

  async partialUpdate(req: any, contractId: number, patchDocument: CreateContractDto) {
    const contract = await this.contractRepository.findOne({
      where: { id: contractId, accountId: Number(req.account_id) },
    });

    Guard.AgainstNullOrUndefined(contract, "contract");

    let contractType;
    let business_partner;

    if (patchDocument.contractTypeId) {
      const ct = await this.contractTypeRepository.findOne({
        where: { id: patchDocument?.contractTypeId, accountId: Number(req.account_id) },
      });
      Guard.AgainstNullOrUndefined(ct, "contractType");
      contractType = ct;
    } else {
      contractType = contract.contractType;
    }

    if (patchDocument.business_partnerId) {
      const ct = await this.business_partnerRepository.findOne({
        where: { id: patchDocument?.business_partnerId, accountId: Number(req.account_id) },
      });
      Guard.AgainstNullOrUndefined(ct, "business_partner");
      business_partner = ct;
    } else {
      business_partner = contract.business_partner;
    }

    const savedContract = await this.contractRepository.update(
      {
        id: contractId,
        accountId: Number(req.account_id),
      },
      {
        contractType,
        business_partner,
        accountId: Number(req.account_id),
        modifiedById: Number(req.account_id),
        ...patchDocument,
      },
    );

    return ResponseManager.StandardResponse(
      "success",
      200,
      "Contract Updated Successfully",
      savedContract,
    );
  }

  async getAllExpiringContracts(accountId: number): Promise<StandardResponse<Contract[]>> {
    const contracts = await this.contractRepository.find({ where: { accountId } });

    const expiredContracts = contracts.filter(
      (con) => moment(con.effectiveDate).add(14, "d").toDate() >= con.currentExpDate,
    );

    return ResponseManager.StandardResponse(
      "success",
      200,
      `${expiredContracts.length} Contracts found`,
      expiredContracts,
    );
  }

  async uploadTemplate(accountId: number, contractId: number, files: Express.Multer.File[]) {
    const contract = await this.contractRepository.findOne({
      where: { id: contractId, accountId },
    });
    Guard.AgainstNullOrUndefined(contract, "contract");

    try {
      const s3 = new AWS.S3({
        credentials: {
          accessKeyId: accessKeyId as string,
          secretAccessKey: secretAccessKey as string,
        },
        region,
      });

      await Promise.all(
        files.map(async (file, index) => {
          const Key = `templates/clause-${Math.floor(Math.random() * 1000)}-${index}.${
            file.originalname
          }`;
          const ContentType = file.mimetype;

          const params = { Bucket: bucketName as string, Key, Body: file.buffer, ContentType };

          const { Location } = await s3.upload(params).promise();

          // save url to database
          const uploadedfiles = this.clauseTemplatesRepository.create({
            contract,
            accountId,
            filename: file.originalname,
            fileUrl: Location,
          });
          await this.clauseTemplatesRepository.save(uploadedfiles);
        }),
      );
      return ResponseManager.StandardResponse("success", 200, "Files Uploaded Successfully", {});
    } catch (error) {
      throw new HttpException("Could not Upload Files", HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
}
