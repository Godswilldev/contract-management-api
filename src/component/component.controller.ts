import { Request } from "express";
import { UpdateResult } from "typeorm";
import { Req } from "@nestjs/common/decorators";
import { PaginationQueryDto } from "src/shared/global.dto";
import { PaginationMeta } from "src/shared/paginationMeta";
import { StandardResponse } from "src/utils/responseManager";
import { ComponentService } from "src/component/component.service";
import { ApiStandardArrayResponse, ApiStandardResponse } from "src/decorators/ApiStandardResponse";
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
  ParseIntPipe,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import {
  ComponentCreationDto,
  ComponentQueryDto,
  ComponentUpdateDto,
} from "src/component/models/component.dto";

@ApiBearerAuth()
@ApiTags("Contract Component")
@Controller("component/:contractId")
@ApiExtraModels(PaginationMeta, StandardResponse, ComponentQueryDto, PaginationQueryDto)
export class ComponentController {
  constructor(private readonly componentService: ComponentService) {}

  @Get()
  @HttpCode(200)
  @ApiStandardArrayResponse(ApiOkResponse, ComponentQueryDto, "Gets all components", PaginationMeta)
  async GetAll(
    @Req() req: Request,
    @Param("contractId", ParseIntPipe) contractId: number,
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<StandardResponse<ComponentQueryDto[]>> {
    // @ts-ignore
    const accountId = req.user.account_id;
    return await this.componentService.GetAll(contractId, Number(accountId), paginationQueryDto);
  }

  @Get(":componentId")
  @HttpCode(200)
  @ApiStandardResponse(ApiOkResponse, ComponentQueryDto, "Gets a component")
  async Get(
    @Req() req: Request,
    @Param("contractId", ParseIntPipe) contractId: number,
    @Param("componentId", ParseIntPipe) componentId: number,
  ): Promise<StandardResponse<ComponentQueryDto>> {
    // @ts-ignore
    const accountId = req.user.account_id;
    return await this.componentService.Get(contractId, Number(accountId), componentId);
  }

  @Post()
  @HttpCode(201)
  @ApiStandardResponse(ApiCreatedResponse, ComponentQueryDto, "Creates a component")
  async Create(
    @Req() req: Request,
    @Param("contractId", ParseIntPipe) contractId: number,
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    componentCreationDto: ComponentCreationDto,
  ): Promise<StandardResponse<ComponentQueryDto>> {
    // @ts-ignore
    const accountId = req.user.account_id;
    return await this.componentService.Create(contractId, Number(accountId), componentCreationDto);
  }

  @Patch(":componentId")
  @HttpCode(200)
  @ApiStandardResponse(ApiOkResponse, ComponentQueryDto, "Updates a component")
  async Update(
    @Req() req: Request,
    @Param("contractId", ParseIntPipe) contractId: number,
    @Param("componentId", ParseIntPipe) componentId: number,
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    componentUpdateDto: ComponentUpdateDto,
  ): Promise<StandardResponse<UpdateResult>> {
    // @ts-ignore
    const accountId = req.user.account_id;
    return await this.componentService.Update(
      contractId,
      accountId,
      componentId,
      componentUpdateDto,
    );
  }

  @Delete(":componentId")
  @HttpCode(204)
  @ApiStandardResponse(ApiNoContentResponse, null, "Deletes a component")
  async Delete(
    @Req() req: Request,
    @Param("contractId", ParseIntPipe) contractId: number,
    @Param("componentId", ParseIntPipe) componentId: number,
  ): Promise<StandardResponse<{}>> {
    // @ts-ignore
    const accountId = req.user.account_id;
    return await this.componentService.Delete(contractId, accountId, componentId);
  }
}
