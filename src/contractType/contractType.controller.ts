import { Request } from "express";
import { UpdateResult } from "typeorm";
import { PaginationMeta } from "src/shared/paginationMeta";
import { PaginationQueryDto } from "src/shared/global.dto";
import { StandardResponse } from "src/utils/responseManager";
import { ContractTypeService } from "src/contractType/contractType.service";
import { ApiStandardArrayResponse, ApiStandardResponse } from "src/decorators/ApiStandardResponse";
import {
  ContractTypeCreationDto,
  ContractTypeQueryDto,
  ContractTypeUpdateDto,
} from "src/contractType/dtos/contractType.dto";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  ValidationPipe,
} from "@nestjs/common";

@ApiBearerAuth()
@ApiTags("Contract Type")
@Controller("contractType")
@ApiExtraModels(PaginationMeta, StandardResponse, ContractTypeQueryDto, PaginationQueryDto)
export class ContractTypeController {
  constructor(private readonly contractTypeService: ContractTypeService) {}

  @Get()
  @HttpCode(200)
  @ApiStandardArrayResponse(
    ApiOkResponse,
    ContractTypeQueryDto,
    "Gets all contract types",
    PaginationMeta,
  )
  async GetContractTypes(
    @Req() req: Request,
    @Query() contractTypeQuery: ContractTypeQueryDto,
  ): Promise<StandardResponse<ContractTypeQueryDto[]>> {
    // @ts-ignore
    const request = req.user;
    return await this.contractTypeService.GetAll(Number(request.account_id), contractTypeQuery);
  }

  @Get(":contractTypeId")
  @HttpCode(200)
  @ApiStandardResponse(ApiOkResponse, ContractTypeQueryDto, "Gets a Contract Type")
  async GetContractType(
    @Param("contractTypeId", ParseIntPipe) contractTypeId: number,
    @Req() req: Request,
  ): Promise<StandardResponse<ContractTypeQueryDto>> {
    // @ts-ignore
    const request = req.user;
    return await this.contractTypeService.Get(Number(request.account_id), contractTypeId);
  }

  @Post()
  @HttpCode(201)
  @ApiStandardResponse(ApiCreatedResponse, ContractTypeQueryDto, "Creates a contract type")
  async CreateContractType(
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    contractTyeCreationDto: ContractTypeCreationDto,
    @Req() req: Request,
  ): Promise<StandardResponse<ContractTypeQueryDto>> {
    // @ts-ignore
    const request = req.user;
    return await this.contractTypeService.create(
      Number(request.account_id),
      contractTyeCreationDto,
    );
  }

  @Patch(":contractTypeId")
  @HttpCode(200)
  @ApiStandardResponse(ApiOkResponse, ContractTypeQueryDto, "Updates contract types")
  async UpdateContractType(
    @Req() req: Request,
    @Param("contractTypeId", ParseIntPipe) contractTypeId: number,
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    contractTyeUpdateDto: ContractTypeUpdateDto,
  ): Promise<StandardResponse<UpdateResult>> {
    // @ts-ignore
    const request = req.user;
    return await this.contractTypeService.update(
      Number(request.account_id),
      contractTypeId,
      contractTyeUpdateDto,
    );
  }

  @Delete(":contractTypeId")
  @HttpCode(204)
  @ApiStandardResponse(ApiNoContentResponse, null, "Deletes a contractType")
  async DeleteContractType(
    @Req() req: Request,
    @Param("contractTypeId", ParseIntPipe) contractTypeId: number,
  ): Promise<StandardResponse<{}>> {
    // @ts-ignore
    const request = req.user;
    return await this.contractTypeService.delete(Number(request.account_id), contractTypeId);
  }
}
