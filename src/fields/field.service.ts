import { Repository } from "typeorm";
import { Guard } from "src/utils/guard";
import { Injectable } from "@nestjs/common";
import { Pagination } from "src/utils/pagination";
import { InjectRepository } from "@nestjs/typeorm";
import { Field } from "src/fields/models/field.entity";
import { PaginationQueryDto } from "src/shared/global.dto";
import { ResponseManager, StandardResponse } from "src/utils/responseManager";
import { FieldQueryDto, FieldCreationDto, FieldUpdateDto } from "src/fields/models/field.dto";

@Injectable()
export class FieldService {
  constructor(@InjectRepository(Field) private readonly fieldRepository: Repository<Field>) {}

  async getAll(
    accountId: number,
    paginationQueryDto: PaginationQueryDto,
  ): Promise<StandardResponse<FieldQueryDto[]>> {
    const pagination = new Pagination(paginationQueryDto);

    const fields = await this.fieldRepository.find({
      where: { accountId },
      ...pagination.GetPaginationDbQuery(),
    });

    const total = await this.fieldRepository.count({
      where: { accountId },
      ...pagination.GetPaginationDbQuery(),
    });

    return ResponseManager.StandardResponse(
      "success",
      200,
      "retrieved all fields",
      fields,
      pagination.GetPaginationResult(total, fields.length),
    );
  }

  async getOne(accountId: number, fieldId: number): Promise<StandardResponse<FieldQueryDto>> {
    const field = await this.fieldRepository.findOne({
      where: { accountId, id: fieldId },
    });

    Guard.AgainstNullOrUndefined(
      field,
      "field",
      ResponseManager.NotFoundResponse("Field not found", { fieldId }),
    );

    return ResponseManager.StandardResponse("success", 200, "retrieved a field", field);
  }

  async create(
    accountId: number,
    fieldCreationDto: FieldCreationDto,
  ): Promise<StandardResponse<FieldQueryDto>> {
    const field = this.fieldRepository.create({ accountId, ...fieldCreationDto });

    const savedfield = await this.fieldRepository.save(field);

    return ResponseManager.StandardResponse("success", 201, "created field ", savedfield);
  }

  async update(accountId: number, fieldId: number, fieldUpdateDto: FieldUpdateDto) {
    const field = await this.fieldRepository.findOne({
      where: { id: fieldId, accountId },
    });

    Guard.AgainstNullOrUndefined(field, "Field");

    const savedfield = await this.fieldRepository.update(
      { id: fieldId, accountId },
      { ...fieldUpdateDto },
    );

    return ResponseManager.StandardResponse("success", 200, "updated field", savedfield);
  }

  async delete(accountId: number, fieldId: number): Promise<StandardResponse<Object>> {
    const existingfield = await this.fieldRepository.findOne({
      where: { accountId, id: fieldId },
    });

    Guard.AgainstNullOrUndefined(existingfield, "field");

    await this.fieldRepository.remove(existingfield);
    return ResponseManager.StandardResponse("success", 204, "deleted field", {});
  }
}

interface AdditionalFields<T> {
  name: string;
  type: T;
  value: string;
}
