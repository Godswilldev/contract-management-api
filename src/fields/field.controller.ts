import { Request } from "express";
import { Req } from "@nestjs/common/decorators";
import { ParseIntPipe } from "@nestjs/common/pipes";
import { FieldService } from "src/fields/field.service";
import { PaginationQueryDto } from "src/shared/global.dto";
import { PaginationMeta } from "src/shared/paginationMeta";
import { StandardResponse } from "src/utils/responseManager";
import { ApiStandardArrayResponse, ApiStandardResponse } from "src/decorators/ApiStandardResponse";
import { FieldCreationDto, FieldQueryDto, FieldUpdateDto } from "src/fields/models/field.dto";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags("Fields")
@Controller("fields")
@ApiExtraModels(PaginationMeta, StandardResponse, FieldQueryDto, PaginationQueryDto)
export class FieldController {
  constructor(private readonly fieldService: FieldService) {}

  @Get()
  @HttpCode(200)
  @ApiStandardArrayResponse(ApiOkResponse, FieldQueryDto, "Gets all fields", PaginationMeta)
  async get(
    @Req() req: Request,
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<StandardResponse<FieldQueryDto[]>> {
    // @ts-ignore
    const accountId = req.user.account_id;
    return await this.fieldService.getAll(Number(accountId), paginationQueryDto);
  }

  @Get(":fieldId")
  @HttpCode(200)
  @ApiStandardResponse(ApiOkResponse, FieldQueryDto, "Gets a field")
  async getOne(
    @Req() req: Request,
    @Param("fieldId", ParseIntPipe) fieldId: number,
  ): Promise<StandardResponse<FieldQueryDto>> {
    // @ts-ignore
    const accountId = req.user.account_id;
    return await this.fieldService.getOne(Number(accountId), fieldId);
  }

  @Post()
  @HttpCode(201)
  @ApiStandardResponse(ApiCreatedResponse, FieldQueryDto, "Creates a field")
  async create(
    @Req() req: Request,
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    fieldCreationDto: FieldCreationDto,
  ): Promise<StandardResponse<FieldQueryDto>> {
    // @ts-ignore
    const accountId = req.user.account_id;
    return await this.fieldService.create(Number(accountId), fieldCreationDto);
  }

  @Patch(":fieldId")
  @HttpCode(200)
  @ApiStandardResponse(ApiOkResponse, FieldQueryDto, "Updates a Field")
  async update(
    @Req() req: Request,
    @Param("fieldId", ParseIntPipe) fieldId: number,
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    fieldUpdateDto: FieldUpdateDto,
  ) {
    // @ts-ignore
    const accountId = req.user.account_id;
    return await this.fieldService.update(Number(accountId), fieldId, fieldUpdateDto);
  }

  @Delete(":fieldId")
  @HttpCode(204)
  @ApiStandardResponse(ApiNoContentResponse, null, "Deletes a field")
  async delete(
    @Req() req: Request,
    @Param("fieldId", ParseIntPipe) fieldId: number,
  ): Promise<StandardResponse<Object>> {
    // @ts-ignore
    const accountId = req.user.account_id;
    return await this.fieldService.delete(Number(accountId), fieldId);
  }
}
