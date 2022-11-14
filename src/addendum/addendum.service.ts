import { Guard } from "src/utils/guard";
import { Injectable } from "@nestjs/common";
import { Pagination } from "src/utils/pagination";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";
import { PaginationQueryDto } from "src/shared/global.dto";
import { Contract } from "src/contract/models/contract.entity";
import { Addendum } from "src/addendum/models/addendum.entity";
import { ContractType } from "src/contractType/models/contractType.entity";
import { ResponseManager, StandardResponse } from "src/utils/responseManager";
import {
  AddendumCreationDto,
  AddendumQueryDto,
  AddendumUpdateDto,
} from "src/addendum/models/addendum.dto";

@Injectable()
export class AddendumService {
  constructor(
    @InjectRepository(Addendum) private readonly addendumRepository: Repository<Addendum>,
    @InjectRepository(Contract) private readonly contractRepository: Repository<Contract>,
    @InjectRepository(ContractType)
    private readonly contractTypeRepository: Repository<ContractType>,
  ) {}

  async GetAll(
    contractId: number,
    accountId: number,
    paginationQueryDto: PaginationQueryDto,
  ): Promise<StandardResponse<AddendumQueryDto[]>> {
    const contract = await this.contractRepository.findOne({
      where: { id: contractId, accountId },
    });

    Guard.AgainstNullOrUndefined(contract, "contract");

    const pagination = new Pagination(paginationQueryDto);

    const addendums = await this.addendumRepository.find({
      where: { contract: { id: contractId, accountId } },
      ...pagination.GetPaginationDbQuery(),
    });

    const total = await this.addendumRepository.count({
      where: { contract: { id: contractId, accountId } },
    });

    return ResponseManager.StandardResponse(
      "success",
      200,
      "Retrieved all Addendums",
      addendums,
      pagination.GetPaginationResult(total, addendums.length),
    );
  }

  async Get(
    contractId: number,
    accountId: number,
    addendumId: number,
  ): Promise<StandardResponse<AddendumQueryDto>> {
    const contract = await this.contractRepository.findOne({
      where: { id: contractId, accountId },
    });

    Guard.AgainstNullOrUndefined(contract, "contract");

    const addendum = await this.addendumRepository.findOne({
      where: { id: addendumId, contract: { id: contractId, accountId } },
      relations: { contract: true },
    });

    Guard.AgainstNullOrUndefined(
      addendum,
      "addendum",
      ResponseManager.NotFoundResponse("No addendum found", { addendumId }),
    );

    return ResponseManager.StandardResponse("success", 200, "Retrieved Addendum", addendum);
  }

  async Create(
    contractId: number,
    accountId: number,
    addendumCreationDto: AddendumCreationDto,
  ): Promise<StandardResponse<AddendumQueryDto>> {
    const contract = await this.contractRepository.findOne({
      where: { id: contractId, accountId },
    });

    Guard.AgainstNullOrUndefined(contract, "contract");

    const contractType = await this.contractTypeRepository.findOne({
      where: { id: addendumCreationDto.contractTypeId, accountId },
    });

    Guard.AgainstNullOrUndefined(contractType, "contractType");

    const addendum = this.addendumRepository.create({
      contract,
      contractType,
      ...addendumCreationDto,
    });

    const newaddendum = await this.addendumRepository.save(addendum);

    return ResponseManager.StandardResponse("success", 201, "Addendum Created", newaddendum);
  }

  async partialUpdate(
    contractId: number,
    accountId: number,
    addendumId: number,
    patchDocument: AddendumUpdateDto,
  ): Promise<StandardResponse<UpdateResult>> {
    const contract = await this.contractRepository.findOne({
      where: { id: contractId, accountId },
    });

    Guard.AgainstNullOrUndefined(contract, "contract");

    const addendum = await this.addendumRepository.findOne({
      where: { id: addendumId, contract: { id: contractId, accountId } },
    });

    Guard.AgainstNullOrUndefined(
      addendum,
      "addendum",
      ResponseManager.NotFoundResponse("No addendum found", { addendumId }),
    );

    const updatedaddendum = await this.addendumRepository.update(
      { id: addendumId, contract: { id: contractId, accountId } },
      { ...patchDocument },
    );

    return ResponseManager.StandardResponse("success", 200, "Addendum Updated", updatedaddendum);
  }

  async Delete(
    contractId: number,
    accountId: number,
    addendumId: number,
  ): Promise<StandardResponse<{}>> {
    const contract = await this.contractRepository.findOne({
      where: { id: contractId, accountId },
    });

    Guard.AgainstNullOrUndefined(contract, "contract");

    const addendum = await this.addendumRepository.findOne({
      where: { contract: { id: contractId, accountId }, id: addendumId },
    });

    Guard.AgainstNullOrUndefined(
      addendum,
      "addendum",
      ResponseManager.NotFoundResponse("No addendum found", { addendumId }),
    );

    await this.addendumRepository.remove(addendum);

    return ResponseManager.StandardResponse("success", 204, "Addendum Deleted", {});
  }
}
