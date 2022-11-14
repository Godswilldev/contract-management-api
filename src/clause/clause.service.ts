import { Repository } from "typeorm";
import { Guard } from "src/utils/guard";
import { Injectable } from "@nestjs/common";
import { Pagination } from "src/utils/pagination";
import { InjectRepository } from "@nestjs/typeorm";
import { Clause } from "src/clause/models/clause.entity";
import { PaginationQueryDto } from "src/shared/global.dto";
import { ContractType } from "src/contractType/models/contractType.entity";
import { ResponseManager, StandardResponse } from "src/utils/responseManager";
import { ClauseQueryDto, ClauseCreationDto, ClauseUpdateDto } from "src/clause/models/clause.dto";

@Injectable()
export class ClauseService {
  constructor(
    @InjectRepository(Clause) private readonly clauseRepository: Repository<Clause>,
    @InjectRepository(ContractType)
    private readonly contractTypeRepository: Repository<ContractType>,
  ) {}

  async getAll(
    accountId: number,
    paginationQueryDto: PaginationQueryDto,
  ): Promise<StandardResponse<ClauseQueryDto[]>> {
    const pagination = new Pagination(paginationQueryDto);

    const clauses = await this.clauseRepository.find({
      where: { accountId },
      ...pagination.GetPaginationDbQuery(),
    });

    const total = await this.clauseRepository.count({
      where: { accountId },
    });

    return ResponseManager.StandardResponse(
      "success",
      200,
      "retrieved all clauses",
      clauses,
      pagination.GetPaginationResult(total, clauses.length),
    );
  }

  async get(accountId: number, clauseId: number): Promise<StandardResponse<ClauseQueryDto>> {
    const clause = await this.clauseRepository.findOne({
      where: { accountId, id: clauseId },
      relations: { conType: true },
    });

    Guard.AgainstNullOrUndefined(
      clause,
      "clause",
      ResponseManager.NotFoundResponse("clause not found", { clauseId }),
    );

    return ResponseManager.StandardResponse("success", 200, "clause retrieved", clause);
  }

  async create(
    accountId: number,
    clauseCreationDto: ClauseCreationDto,
  ): Promise<StandardResponse<ClauseQueryDto>> {
    const conType = await this.contractTypeRepository.findOne({
      where: { id: clauseCreationDto.conTypeId, accountId },
    });

    Guard.AgainstNullOrUndefined(conType, "contract type");

    const clause = this.clauseRepository.create({ accountId, conType, ...clauseCreationDto });

    const savedClause = await this.clauseRepository.save(clause);

    return ResponseManager.StandardResponse("success", 201, "created clause", savedClause);
  }

  async update(accountId: number, clauseId: number, clauseUpdateDto: ClauseUpdateDto) {
    const clause = await this.clauseRepository.findOne({
      where: { id: clauseId, accountId },
    });

    Guard.AgainstNullOrUndefined(clause, "clause");

    const conType = await this.contractTypeRepository.findOne({
      where: { id: clauseUpdateDto.conTypeId },
    });

    Guard.AgainstNullOrUndefined(conType, "contract type");

    const savedClause = await this.clauseRepository.update(
      { id: clauseId, accountId },
      {
        accountId,
        conType,
        content: clauseUpdateDto?.content,
        name: clauseUpdateDto.name,
        clauseType: clauseUpdateDto.clauseType,
      },
    );

    return ResponseManager.StandardResponse("success", 200, "updated clause", savedClause);
  }

  async delete(accountId: number, clauseId: number): Promise<StandardResponse<Object>> {
    const existingClause = await this.clauseRepository.findOne({
      where: { accountId, id: clauseId },
    });

    Guard.AgainstNullOrUndefined(existingClause, "clause");

    await this.clauseRepository.remove(existingClause);
    return ResponseManager.StandardResponse("success", 204, "deleted clause", {});
  }
}
