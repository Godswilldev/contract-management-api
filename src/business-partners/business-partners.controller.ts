import { Request } from "express";
import { UpdateResult } from "typeorm";
import { ParseIntPipe } from "@nestjs/common/pipes";
import { PaginationQueryDto } from "src/shared/global.dto";
import { PaginationMeta } from "src/shared/paginationMeta";
import { StandardResponse } from "src/utils/responseManager";
import { BusinessPartnersService } from "src/business-partners/business-partners.service";
import { ApiStandardArrayResponse, ApiStandardResponse } from "src/decorators/ApiStandardResponse";
import {
  BusinessPartnerQueryDto,
  CreateBusinessPartnerDto,
  UpdateBusinessPartnerDto,
} from "src/business-partners/dto/business-partner.dto";
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
  Controller,
  Get,
  Post,
  Req,
  Body,
  HttpCode,
  Patch,
  Param,
  Delete,
  ValidationPipe,
} from "@nestjs/common";

@Controller("business-partners")
@ApiBearerAuth()
@ApiTags("Business Partners")
@ApiExtraModels(PaginationMeta, StandardResponse, BusinessPartnerQueryDto, PaginationQueryDto)
export class BusinessPartnersController {
  constructor(private readonly businessPartnersService: BusinessPartnersService) {}

  @Post()
  @HttpCode(201)
  @ApiStandardResponse(ApiCreatedResponse, BusinessPartnerQueryDto, "Creates a Business Partner")
  create(
    @Req() req: Request,
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    createBusinessPartnerDto: CreateBusinessPartnerDto,
  ): Promise<StandardResponse<BusinessPartnerQueryDto>> {
    // @ts-ignore
    const accountId = req.user.account_id;
    return this.businessPartnersService.create(Number(accountId), createBusinessPartnerDto);
  }

  @Get()
  @HttpCode(200)
  @ApiStandardArrayResponse(
    ApiOkResponse,
    BusinessPartnerQueryDto,
    "Gets All Business Partners in an Account",
  )
  findAll(@Req() req: Request): Promise<StandardResponse<BusinessPartnerQueryDto[]>> {
    // @ts-ignore
    const accountId = req.user.account_id;
    return this.businessPartnersService.findAll(Number(accountId));
  }

  @Get(":id")
  @HttpCode(200)
  @ApiStandardResponse(ApiOkResponse, BusinessPartnerQueryDto, "Gets One Business Partner")
  findOne(
    @Param("id", ParseIntPipe) id: number,
    @Req() req: Request,
  ): Promise<StandardResponse<BusinessPartnerQueryDto>> {
    // @ts-ignore
    const accountId = req.user.account_id;
    return this.businessPartnersService.findOne(Number(accountId), id);
  }

  @Patch(":id")
  @HttpCode(200)
  @ApiBody({ type: CreateBusinessPartnerDto })
  @ApiStandardResponse(
    ApiOkResponse,
    BusinessPartnerQueryDto,
    "Updates Parts of an Additional Field",
  )
  update(
    @Req() req: Request,
    @Param("id", ParseIntPipe) id: number,
    @Body() updateBusinessPartnerDto: UpdateBusinessPartnerDto,
  ): Promise<StandardResponse<UpdateResult>> {
    // @ts-ignore
    const accountId = req.user.account_id;
    return this.businessPartnersService.update(Number(accountId), id, updateBusinessPartnerDto);
  }

  @Delete(":id")
  @HttpCode(204)
  @ApiStandardResponse(ApiNoContentResponse, null, "Deletes a Business Partner")
  remove(@Req() req: Request, @Param("id", ParseIntPipe) id: number) {
    // @ts-ignore
    const accountId = req.user.account_id;

    return this.businessPartnersService.remove(Number(accountId), id);
  }
}
