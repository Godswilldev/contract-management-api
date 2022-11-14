import { Guard } from "src/utils/guard";
import { Injectable } from "@nestjs/common";
import { Repository, UpdateResult } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ContractType } from "src/contractType/models/contractType.entity";
import { ResponseManager, StandardResponse } from "src/utils/responseManager";
import {
  ContractTypeQueryDto,
  ContractTypeUpdateDto,
  ContractTypeCreationDto,
} from "src/contractType/dtos/contractType.dto";

@Injectable()
export class ContractTypeService {
  constructor(
    @InjectRepository(ContractType)
    private readonly contractTypeRepository: Repository<ContractType>,
  ) {}

  async delete(accountId: number, contractTypeId: number): Promise<StandardResponse<{}>> {
    const existingContractType = await this.contractTypeRepository.findOne({
      where: { accountId, id: contractTypeId },
    });

    Guard.AgainstNullOrUndefined(existingContractType, "contract type");

    await this.contractTypeRepository.remove(existingContractType);
    return ResponseManager.StandardResponse("success", 204, "deleted contract type", {});
  }

  async update(
    accountId: number,
    contractTypeId: number,
    contractTypeUpdateDto: ContractTypeUpdateDto,
  ): Promise<StandardResponse<UpdateResult>> {
    const existingContractType = await this.contractTypeRepository.findOne({
      where: { accountId, id: contractTypeId },
    });

    Guard.AgainstNullOrUndefined(existingContractType, "contract type");

    const savedContractType = await this.contractTypeRepository.update(
      { accountId, id: contractTypeId },
      { ...contractTypeUpdateDto },
    );

    return ResponseManager.StandardResponse(
      "success",
      200,
      "updated contract type",
      savedContractType,
    );
  }

  async create(
    accountId: number,
    contractTyeCreationDto: ContractTypeCreationDto,
  ): Promise<StandardResponse<ContractTypeQueryDto>> {
    const contractType = this.contractTypeRepository.create({
      accountId,
      ...contractTyeCreationDto,
    });

    const savedContractType = await this.contractTypeRepository.save(contractType);

    return ResponseManager.StandardResponse(
      "success",
      201,
      "created contract type",
      savedContractType,
    );
  }

  async Get(
    accountId: number,
    contractTypeId: number,
  ): Promise<StandardResponse<ContractTypeQueryDto>> {
    const contractType = await this.contractTypeRepository.findOne({
      where: { accountId, id: contractTypeId },
    });

    Guard.AgainstNullOrUndefined(contractType, "contract type");

    return ResponseManager.StandardResponse(
      "success",
      200,
      "retrieved contract type",
      contractType,
    );
  }

  async GetAll(
    accountId: number,
    contractTypeQuery: ContractTypeQueryDto,
  ): Promise<StandardResponse<ContractTypeQueryDto[]>> {
    const contractTypes = await this.contractTypeRepository.find({
      where: { accountId, ...contractTypeQuery },
    });

    return ResponseManager.StandardResponse(
      "success",
      200,
      "Retrieved All Contract Types",
      contractTypes,
    );
  }
}
