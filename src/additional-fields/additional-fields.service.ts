import { Guard } from "src/utils/guard";
import { Injectable } from "@nestjs/common";
import { Repository, UpdateResult } from "typeorm";
import { Pagination } from "src/utils/pagination";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginationQueryDto } from "src/shared/global.dto";
import { Contract } from "src/contract/models/contract.entity";
import { ResponseManager, StandardResponse } from "src/utils/responseManager";
import { AdditionalFields } from "src/additional-fields/model/additional-fields.entity";
import {
  AdditionalFieldsCreateDto,
  AdditionalFieldsQueryDto,
  AdditionalFieldsUpdateDto,
} from "src/aditional-fields/model/additional-fields.dto";

@Injectable()
export class AdditionalFieldsService {
  constructor(
    @InjectRepository(AdditionalFields)
    private readonly additionalFieldsRepository: Repository<AdditionalFields>,
    @InjectRepository(Contract) private readonly contractRepository: Repository<Contract>,
  ) {}

  async GetAll(
    contractId: number,
    accountId: number,
  ): Promise<StandardResponse<AdditionalFieldsQueryDto[]>> {
    const contract = await this.contractRepository.findOne({
      where: { id: contractId, accountId },
    });

    Guard.AgainstNullOrUndefined(contract, "contract");

    const additionalFields = await this.additionalFieldsRepository.find({
      where: { contract: { id: contractId, accountId } },
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
  ): Promise<StandardResponse<AdditionalFieldsQueryDto>> {
    const contract = await this.contractRepository.findOne({
      where: { id: contractId, accountId },
    });

    Guard.AgainstNullOrUndefined(contract, "contract");

    const additionalField = await this.additionalFieldsRepository.findOne({
      where: { id: additionalFieldId, contract: { id: contractId, accountId } },
      relations: { contract: true },
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
