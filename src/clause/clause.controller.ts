import { Request } from "express";
import { PatchSpec } from "src/shared/patchingDto";
import { ParseIntPipe } from "@nestjs/common/pipes";
import { ClauseService } from "src/clause/clause.service";
import { PaginationMeta } from "src/shared/paginationMeta";
import { StandardResponse } from "src/utils/responseManager";
import { Req } from "@nestjs/common/decorators/http/route-params.decorator";
import { ContractTypeIdDto, PaginationQueryDto } from "src/shared/global.dto";
import { ApiStandardArrayResponse, ApiStandardResponse } from "src/decorators/ApiStandardResponse";
import { ClauseCreationDto, ClauseQueryDto, ClauseUpdateDto } from "src/clause/models/clause.dto";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
  ValidationPipe,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags("Clauses")
@Controller("clause")
@ApiExtraModels(PaginationMeta, StandardResponse, ClauseQueryDto, PaginationQueryDto, PatchSpec)
export class ClauseController {
  constructor(private readonly clauseService: ClauseService) {}

  @Get()
  @HttpCode(200)
  @ApiStandardArrayResponse(ApiOkResponse, ClauseQueryDto, "Gets all clauses", PaginationMeta)
  async getAll(
    @Req() req: Request,
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<StandardResponse<ClauseQueryDto[]>> {
    // @ts-ignore
    const request = req.user;
    return await this.clauseService.getAll(Number(request.account_id), paginationQueryDto);
  }

  @Get(":clauseId")
  @HttpCode(200)
  @ApiStandardResponse(ApiOkResponse, ClauseQueryDto, "Gets a clause")
  async get(
    @Req() req: Request,
    @Param("clauseId", ParseIntPipe) clauseId: number,
  ): Promise<StandardResponse<ClauseQueryDto>> {
    // @ts-ignore
    const request = req.user;
    return await this.clauseService.get(Number(request.account_id), clauseId);
  }

  @Post()
  @HttpCode(201)
  @ApiStandardResponse(ApiCreatedResponse, ClauseQueryDto, "Creates a clause")
  async create(
    @Req() req: Request,
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    clauseCreationDto: ClauseCreationDto,
  ): Promise<StandardResponse<ClauseQueryDto>> {
    // @ts-ignore
    const request = req.user;
    return await this.clauseService.create(Number(request.account_id), clauseCreationDto);
  }

  @Patch(":clauseId")
  @HttpCode(200)
  @ApiStandardResponse(ApiOkResponse, ClauseQueryDto, "Updates a clause")
  async update(
    @Req() req: Request,
    @Param("clauseId", ParseIntPipe) clauseId: number,
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    clauseUpdateDto: ClauseUpdateDto,
  ) {
    // @ts-ignore
    const request = req.user;
    return await this.clauseService.update(Number(request.account_id), clauseId, clauseUpdateDto);
  }

  @Delete(":clauseId")
  @HttpCode(204)
  @ApiStandardResponse(ApiNoContentResponse, null, "Deletes a clause")
  async delete(
    @Param("accountId", ParseIntPipe) accountId: number,
    @Param("clauseId", ParseIntPipe) clauseId: number,
  ): Promise<StandardResponse<Object>> {
    return await this.clauseService.delete(accountId, clauseId);
  }
}
