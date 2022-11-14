import * as moment from "moment";
import { Guard } from "src/utils/guard";
import { Injectable } from "@nestjs/common";
import { Between, Repository } from "typeorm";
import { Pagination } from "src/utils/pagination";
import { InjectRepository } from "@nestjs/typeorm";
import { PatchSpec } from "src/shared/patchingDto";
import { Field } from "src/fields/models/field.entity";
import { applyPatch, Operation } from "fast-json-patch";
import { ContractStatus } from "src/utils/contractStatues";
import { Contract } from "src/contract/models/contract.entity";
import { Component } from "src/component/models/component.entity";
import { getCorrectObject } from "src/utils/get-correct-object.utils";
import { contractQueryFields } from "src/constants/contract.constants";
import { ContractType } from "src/contractType/models/contractType.entity";
import { CreateContractDto, QueryDto } from "src/contract/dtos/contract.dto";
import { ResponseManager, StandardResponse } from "src/utils/responseManager";

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(Contract) private readonly contractRepository: Repository<Contract>,
    @InjectRepository(ContractType)
    private readonly contractTypeRepository: Repository<ContractType>,
  ) {}

  async GetAllContractsByAccountId(accountId: number, queryDto: QueryDto) {
    const queryObj = { ...queryDto };

    delete queryObj["status"];

    let status = queryDto?.status?.split("&");

    const query = getCorrectObject(contractQueryFields, queryObj);

    const pagination = new Pagination(queryDto);

    let contracts: Contract[] = [];

    if (status) {
      contracts = await this.contractRepository.find({
        where: [
          {
            accountId,
            // @ts-ignore
            status: status[0],
          },
          {
            accountId,
            // @ts-ignore
            status: status[1],
          },
          {
            accountId,
            // @ts-ignore
            status: status[2],
          },
        ],
        ...pagination.GetPaginationDbQuery(),
      });
    } else {
      contracts = await this.contractRepository.find({
        where: {
          accountId,
          ...query,
          ...pagination.GetPaginationDbQuery(),
        },
      });
    }

    const total = await this.contractRepository.count({
      where: {
        accountId,
        ...query,
      },
    });

    return ResponseManager.StandardResponse(
      "success",
      200,
      `${contracts.length} Contracts found`,
      contracts,
      pagination.GetPaginationResult(total, contracts.length),
    );
  }

  async Get(accountId: number, contractId: number): Promise<StandardResponse<Contract>> {
    const contract = await this.contractRepository.findOne({
      where: { id: contractId, accountId },
      relations: [
        "contractType",
        "clauses",
        "fields",
        "versions",
        "comments",
        "components",
        "addendums",
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
      contractType,
      accountId: Number(req.account_id),
      createdById: Number(req.account_id),
      modifiedById: Number(req.account_id),
      ...contractCreationDto,
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

    const savedContract = await this.contractRepository.update(
      {
        id: contractId,
        accountId: Number(req.account_id),
      },
      { accountId: Number(req.account_id), modifiedById: Number(req.account_id), ...patchDocument },
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
}
