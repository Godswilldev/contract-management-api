import {
  Req,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  HttpCode,
  Controller,
  ParseIntPipe,
  ValidationPipe,
} from "@nestjs/common";

import {
  ApiTags,
  ApiBody,
  ApiOkResponse,
  ApiBearerAuth,
  ApiExtraModels,
  ApiCreatedResponse,
} from "@nestjs/swagger";

import { Request } from "express";
import { PatchSpec } from "src/shared/patchingDto";
import { PaginationQueryDto } from "src/shared/global.dto";
import { PaginationMeta } from "src/shared/paginationMeta";
import { StandardResponse } from "src/utils/responseManager";
import { Contract } from "src/contract/models/contract.entity";
import { ContractService } from "src/contract/contract.service";
import { ContractQueryDto } from "src/contract/dtos/contract.dto";
import { CreateContractDto, QueryDto } from "src/contract/dtos/contract.dto";
import { ApiStandardArrayResponse, ApiStandardResponse } from "src/decorators/ApiStandardResponse";

@ApiBearerAuth()
@ApiTags("Contract")
@Controller("contract")
@ApiExtraModels(PaginationMeta, StandardResponse, ContractQueryDto, PaginationQueryDto)
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Get()
  @HttpCode(200)
  @ApiStandardArrayResponse(ApiOkResponse, ContractQueryDto, "Gets all Contracts", PaginationMeta)
  async GetAll(
    @Req() req: Request,
    @Query() queryDto: QueryDto,
  ): Promise<StandardResponse<Contract[]>> {
    // @ts-ignore
    const request = req.user;
    return await this.contractService.GetAllContractsByAccountId(
      Number(request.account_id),
      queryDto,
    );
  }

  @Get(":contractId")
  @HttpCode(200)
  @ApiStandardResponse(ApiOkResponse, ContractQueryDto, "Gets A Contract by ContractId")
  async GetContract(
    @Req() req: Request,
    @Param("contractId", ParseIntPipe) contractId: number,
  ): Promise<StandardResponse<Contract>> {
    // @ts-ignore
    const request = req.user;
    return await this.contractService.Get(Number(request.account_id), contractId);
  }

  @Post()
  @HttpCode(201)
  @ApiStandardResponse(ApiCreatedResponse, ContractQueryDto, "Creates a contract")
  async CreateContract(
    @Req() req: Request,
    @Body(new ValidationPipe({ whitelist: false, transform: true }))
    contractCreationDto: CreateContractDto,
  ): Promise<StandardResponse<Contract>> {
    // @ts-ignore
    const request = req.user;
    return await this.contractService.Create(request, contractCreationDto);
  }

  @Patch(":contractId")
  @HttpCode(200)
  @ApiBody({ type: [PatchSpec] })
  @ApiStandardResponse(ApiOkResponse, ContractQueryDto, "updates some parts of a contract")
  async partialUpdate(
    @Req() req: Request,
    @Param("contractId", ParseIntPipe) contractId: number,
    @Body(new ValidationPipe({ transform: true }))
    patchDocument: CreateContractDto,
  ) {
    // @ts-ignore
    const request = req.user;
    return await this.contractService.partialUpdate(request, contractId, patchDocument);
  }

  // Get all expiring contracts (2 Weeks Margin)
  @Get("expiring/two-weeks")
  @HttpCode(200)
  async GetALlExpiringContracts(@Req() req: Request): Promise<StandardResponse<Contract[]>> {
    // @ts-ignore
    const request = req.user;

    return await this.contractService.getAllExpiringContracts(Number(request.account_id));
  }
}
