import { Request } from "express";
import { UpdateResult } from "typeorm";
import { PaginationQueryDto } from "src/shared/global.dto";
import { PaginationMeta } from "src/shared/paginationMeta";
import { StandardResponse } from "src/utils/responseManager";
import { AddendumService } from "src/addendum/addendum.service";
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
  Req,
  ValidationPipe,
  ParseIntPipe,
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
import {
  AddendumCreationDto,
  AddendumQueryDto,
  AddendumUpdateDto,
} from "src/addendum/models/addendum.dto";

@ApiBearerAuth()
@ApiTags("Contract Addendum")
@Controller("addendum/:contractId")
@ApiExtraModels(PaginationMeta, StandardResponse, AddendumQueryDto, PaginationQueryDto)
export class AddendumController {
  constructor(private readonly addendumService: AddendumService) {}

  @Get()
  @HttpCode(200)
  @ApiStandardArrayResponse(ApiOkResponse, AddendumQueryDto, "Gets all addendums", PaginationMeta)
  async GetAll(
    @Param("contractId", ParseIntPipe) contractId: number,
    @Req() req: Request,
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<StandardResponse<AddendumQueryDto[]>> {
    // @ts-ignore
    const accountId = req.user.account_id;
    return await this.addendumService.GetAll(contractId, Number(accountId), paginationQueryDto);
  }

  @Get(":addendumId")
  @HttpCode(200)
  @ApiStandardResponse(ApiOkResponse, AddendumQueryDto, "Gets an Addendum")
  async Get(
    @Param("contractId", ParseIntPipe) contractId: number,
    @Param("addendumId", ParseIntPipe) addendumId: number,
    @Req() req: Request,
  ): Promise<StandardResponse<AddendumQueryDto>> {
    // @ts-ignore
    const accountId = req.user.account_id;
    return await this.addendumService.Get(contractId, Number(accountId), addendumId);
  }

  @Post()
  @HttpCode(201)
  @ApiStandardResponse(ApiCreatedResponse, AddendumQueryDto, "Creates an Addendum")
  async Create(
    @Param("contractId", ParseIntPipe) contractId: number,
    @Req() req: Request,
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    addendumCreationDto: AddendumCreationDto,
  ): Promise<StandardResponse<AddendumQueryDto>> {
    // @ts-ignore
    const accountId = req.user.account_id;
    return await this.addendumService.Create(contractId, Number(accountId), addendumCreationDto);
  }

  @Patch(":addendumId")
  @HttpCode(200)
  @ApiBody({ type: AddendumUpdateDto })
  @ApiStandardResponse(ApiOkResponse, AddendumQueryDto, "Updates Parts of an Addendum")
  async partialUpdate(
    @Param("contractId", ParseIntPipe) contractId: number,
    @Param("addendumId", ParseIntPipe) addendumId: number,
    @Req() req: Request,
    @Body(new ValidationPipe({ transform: true }))
    patchDocument: AddendumUpdateDto,
  ): Promise<StandardResponse<UpdateResult>> {
    // @ts-ignore
    const accountId = req.user.account_id;
    return await this.addendumService.partialUpdate(
      contractId,
      Number(accountId),
      addendumId,
      patchDocument,
    );
  }

  @Delete(":addendumId")
  @HttpCode(204)
  @ApiStandardResponse(ApiNoContentResponse, null, "Deletes an Addendum")
  async Delete(
    @Param("contractId", ParseIntPipe) contractId: number,
    @Param("addendumId", ParseIntPipe) addendumId: number,
    @Req() req: Request,
  ): Promise<StandardResponse<{}>> {
    // @ts-ignore
    const accountId = req.user.account_id;
    return await this.addendumService.Delete(contractId, Number(accountId), addendumId);
  }
}
