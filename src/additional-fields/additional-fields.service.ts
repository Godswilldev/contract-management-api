import { Guard } from "src/utils/guard";
import { Injectable } from "@nestjs/common";
import { Repository, UpdateResult } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Contract } from "src/contract/models/contract.entity";
import { ResponseManager, StandardResponse } from "src/utils/responseManager";
import { AdditionalFields } from "src/additional-fields/model/additional-fields.entity";
import {
  AdditionalFieldsCreateDto,
  AdditionalFieldsQueryDto,
  AdditionalFieldsUpdateDto,
} from "src/additional-fields/model/additional-fields.dto";
import { ContractType } from "src/contractType/models/contractType.entity";

@Injectable()
export class AdditionalFieldsService {
  constructor(
    @InjectRepository(AdditionalFields)
    private readonly additionalFieldsRepository: Repository<AdditionalFields>,
    @InjectRepository(Contract) private readonly contractRepository: Repository<Contract>,
    @InjectRepository(ContractType)
    private readonly contractTypeRepository: Repository<ContractType>,
  ) {}

  async GetAll(
    contractId: number,
    accountId: number,
    contractTypeId: number,
  ): Promise<StandardResponse<AdditionalFieldsQueryDto[]>> {
    const contract = await this.contractRepository.findOne({
      where: { id: contractId, accountId },
    });

    Guard.AgainstNullOrUndefined(contract, "contract");

    const contractType = await this.contractTypeRepository.findOne({
      where: { id: contractTypeId, accountId },
    });

    Guard.AgainstNullOrUndefined(contractType, "contractTypeId");

    const additionalFields = await this.additionalFieldsRepository.find({
      where: {
        contract: { id: contractId, accountId },
        contractType: { id: contractTypeId, accountId },
      },
    });

    return ResponseManager.StandardResponse(
      "success",
      200,
      "Retrieved all additionalFields",
      additionalFields,
    );
  }

  async Get(
    contractId: number,
    accountId: number,
    additionalFieldId: number,
    contractTypeId: number,
  ): Promise<StandardResponse<AdditionalFieldsQueryDto>> {
    const contract = await this.contractRepository.findOne({
      where: { id: contractId, accountId },
    });

    Guard.AgainstNullOrUndefined(contract, "contract");

    const contractType = await this.contractTypeRepository.findOne({
      where: { id: contractTypeId, accountId },
    });

    Guard.AgainstNullOrUndefined(contractType, "contractTypeId");

    const additionalField = await this.additionalFieldsRepository.findOne({
      where: {
        id: additionalFieldId,
        contract: { id: contractId, accountId },
        contractType: { id: contractTypeId, accountId },
      },
      relations: { contract: true, contractType: true },
    });

    Guard.AgainstNullOrUndefined(
      additionalField,
      "additionalField",
      ResponseManager.NotFoundResponse("No AdditionalField found", { additionalFieldId }),
    );

    return ResponseManager.StandardResponse(
      "success",
      200,
      "Retrieved additionalField",
      additionalField,
    );
  }

  async Create(
    contractId: number,
    accountId: number,
    additionalFieldCreationDto: AdditionalFieldsCreateDto,
  ): Promise<StandardResponse<AdditionalFieldsQueryDto>> {
    const contract = await this.contractRepository.findOne({
      where: { id: contractId, accountId },
    });

    Guard.AgainstNullOrUndefined(contract, "contract");

    const additionalField = this.additionalFieldsRepository.create({
      contract,
      ...additionalFieldCreationDto,
    });

    const newAdditionalField = await this.additionalFieldsRepository.save(additionalField);

    return ResponseManager.StandardResponse(
      "success",
      201,
      "additionalField Created",
      newAdditionalField,
    );
  }

  async partialUpdate(
    contractId: number,
    accountId: number,
    additionalFieldId: number,
    patchDocument: AdditionalFieldsUpdateDto,
  ): Promise<StandardResponse<UpdateResult>> {
    const contract = await this.contractRepository.findOne({
      where: { id: contractId, accountId },
    });

    Guard.AgainstNullOrUndefined(contract, "contract");

    const additionalField = await this.additionalFieldsRepository.findOne({
      where: { id: additionalFieldId, contract: { id: contractId, accountId } },
    });

    Guard.AgainstNullOrUndefined(
      additionalField,
      "additionalField",
      ResponseManager.NotFoundResponse("No additionalField found", { additionalFieldId }),
    );

    const updatedadditionalField = await this.additionalFieldsRepository.update(
      { id: additionalFieldId, contract: { id: contractId, accountId } },
      { ...patchDocument },
    );

    return ResponseManager.StandardResponse(
      "success",
      200,
      "additionalField Updated",
      updatedadditionalField,
    );
  }

  async Delete(
    contractId: number,
    accountId: number,
    additionalFieldId: number,
  ): Promise<StandardResponse<{}>> {
    const contract = await this.contractRepository.findOne({
      where: { id: contractId, accountId },
    });

    Guard.AgainstNullOrUndefined(contract, "contract");

    const additionalField = await this.additionalFieldsRepository.findOne({
      where: { contract: { id: contractId, accountId }, id: additionalFieldId },
    });

    Guard.AgainstNullOrUndefined(
      additionalField,
      "additionalField",
      ResponseManager.NotFoundResponse("No additionalField found", { additionalFieldId }),
    );

    await this.additionalFieldsRepository.remove(additionalField);

    return ResponseManager.StandardResponse("success", 204, "additionalField Deleted", {});
  }
}
