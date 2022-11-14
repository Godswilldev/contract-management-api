import { Request } from "express";
import { StandardResponse } from "src/utils/responseManager";
import { Controller, Get, HttpCode, Req } from "@nestjs/common";
import { DashboardService } from "src/dashboard/dashobard.service";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ApiStandardArrayResponse } from "src/decorators/ApiStandardResponse";
import {
  ContractAmountsPerHolderNameDto,
  ContractsPerHolderNameDto,
} from "src/dashboard/models/dashboard.dto";

@ApiBearerAuth()
@ApiTags("Dashboard")
@Controller("dashobard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("contracts-per-holder-name")
  @HttpCode(200)
  @ApiStandardArrayResponse(ApiOkResponse, ContractsPerHolderNameDto, "Gets a contract type")
  async GetContractCountPerHolderName(
    @Req() req: Request,
  ): Promise<StandardResponse<ContractsPerHolderNameDto[]>> {
    // @ts-ignore
    const request = req.user;
    return await this.dashboardService.GetContractsPerHolderName(request.account_id);
  }

  @Get("amount-per-holder-name")
  @HttpCode(200)
  @ApiStandardArrayResponse(ApiOkResponse, ContractAmountsPerHolderNameDto, "Gets a contract type")
  async GetAmountPerHolderName(
    @Req() req: Request,
  ): Promise<StandardResponse<ContractAmountsPerHolderNameDto[]>> {
    // @ts-ignore
    const request = req.user;
    return await this.dashboardService.GetAmmountPerHolderName(request.account_id);
  }
}
