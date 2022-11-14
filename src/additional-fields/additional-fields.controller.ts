import {
  Get,
  Req,
  Body,
  Post,
  Param,
  Query,
  Patch,
  Delete,
  HttpCode,
  Controller,
  ParseIntPipe,
  ValidationPipe,
} from "@nestjs/common";
import { Request } from "express";
import { UpdateResult } from "typeorm";
import { PaginationQueryDto } from "src/shared/global.dto";
import { PaginationMeta } from "src/shared/paginationMeta";
import { StandardResponse } from "src/utils/responseManager";
import { AdditionalFieldsService } from "src/additional-fields/additional-fields.service";
import { ApiStandardArrayResponse, ApiStandardResponse } from "src/decorators/ApiStandardResponse";
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import {
  AdditionalFieldsCreateDto,
  AdditionalFieldsQueryDto,
  AdditionalFieldsUpdateDto,
} from "src/additional-fields/model/additional-fields.dto";

@ApiBearerAuth()
@ApiTags("Contract Additional Fields")
@Controller("additional-fields/:contractId")
@ApiExtraModels(PaginationMeta, StandardResponse, AdditionalFieldsQueryDto, PaginationQueryDto)
export class AdditionalFieldsController {
  constructor(private readonly additionalFieldsService: AdditionalFieldsService) {}

  @Get()
  @HttpCode(200)
  @ApiStandardArrayResponse(ApiOkResponse, AdditionalFieldsQueryDto, "Gets all Additional Fields")
  async GetAll(
    @Param("contractId", ParseIntPipe) contractId: number,
    @Req() req: Request,
  ): Promise<StandardResponse<AdditionalFieldsQueryDto[]>> {
    // @ts-ignore
    const accountId = req.user.account_id;
    return await this.additionalFieldsService.GetAll(contractId, Number(accountId));
  }

  @HttpCode(200)
  @Get(":additionalFieldId")
  @ApiStandardArrayResponse(ApiOkResponse, AdditionalFieldsQueryDto, "Gets One Additional Field")
  async Get(
    @Param("contractId", ParseIntPipe) contractId: number,
    @Param("additionalFieldId", ParseIntPipe) additionalFieldId: number,
    @Req() req: Request,
  ): Promise<StandardResponse<AdditionalFieldsQueryDto>> {
    // @ts-ignore
    const accountId = req.user.account_id;
    return await this.additionalFieldsService.Get(contractId, Number(accountId), additionalFieldId);
  }

  @Post()
  @HttpCode(201)
  @ApiStandardResponse(ApiCreatedResponse, AdditionalFieldsQueryDto, "Creates an Additional Field")
  async Create(
    @Param("contractId", ParseIntPipe) contractId: number,
    @Req() req: Request,
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    additionalFieldsCreateDto: AdditionalFieldsCreateDto,
  ): Promise<StandardResponse<AdditionalFieldsQueryDto>> {
    // @ts-ignore
    const accountId = req.user.account_id;
    return await this.additionalFieldsService.Create(
      contractId,
      Number(accountId),
      additionalFieldsCreateDto,
    );
  }

  @Patch(":additionalFieldId")
  @HttpCode(200)
  @ApiBody({ type: AdditionalFieldsUpdateDto })
  @ApiStandardResponse(
    ApiOkResponse,
    AdditionalFieldsQueryDto,
    "Updates Parts of an Additional Field",
  )
  async partialUpdate(
    @Param("contractId", ParseIntPipe) contractId: number,
    @Param("additionalFieldId", ParseIntPipe) additionalFieldId: number,
    @Req() req: Request,
    @Body(new ValidationPipe({ transform: true }))
    patchDocument: AdditionalFieldsUpdateDto,
  ): Promise<StandardResponse<UpdateResult>> {
    // @ts-ignore
    const accountId = req.user.account_id;
    return await this.additionalFieldsService.partialUpdate(
      contractId,
      Number(accountId),
      additionalFieldId,
      patchDocument,
    );
  }

  @Delete(":additionalFieldId")
  @HttpCode(204)
  @ApiStandardResponse(ApiNoContentResponse, null, "Deletes an Additional Field")
  async Delete(
    @Param("contractId", ParseIntPipe) contractId: number,
    @Param("additionalFieldId", ParseIntPipe) additionalFieldId: number,
    @Req() req: Request,
  ): Promise<StandardResponse<{}>> {
    // @ts-ignore
    const accountId = req.user.account_id;
    return await this.additionalFieldsService.Delete(
      contractId,
      Number(accountId),
      additionalFieldId,
    );
  }
}
