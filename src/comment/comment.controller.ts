import { Request } from "express";
import { ParseIntPipe } from "@nestjs/common/pipes";
import { PaginationQueryDto } from "src/shared/global.dto";
import { PaginationMeta } from "src/shared/paginationMeta";
import { StandardResponse } from "src/utils/responseManager";
import { CommentService } from "src/comment/comment.service";
import { ApiStandardArrayResponse, ApiStandardResponse } from "src/decorators/ApiStandardResponse";
import {
  CommentCreationDto,
  CommentQueryDto,
  CommentUpdateDto,
} from "src/comment/models/comment.dto";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiExtraModels,
  ApiCreatedResponse,
  ApiNoContentResponse,
} from "@nestjs/swagger";
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
  ValidationPipe,
} from "@nestjs/common";

@ApiBearerAuth()
@ApiTags("Contract Comment")
@Controller("comment/:contractId")
@ApiExtraModels(PaginationMeta, StandardResponse, CommentQueryDto, PaginationQueryDto)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  @HttpCode(200)
  @ApiStandardArrayResponse(ApiOkResponse, CommentQueryDto, "Gets All Comments", PaginationMeta)
  async GetAll(
    @Param("contractId", ParseIntPipe) contractId: number,
    @Req() req: Request,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    // @ts-ignore
    const accountId = req.user.account_id;
    return await this.commentService.GetAll(contractId, Number(accountId), paginationQueryDto);
  }

  @Get(":commentId")
  @HttpCode(200)
  @ApiStandardResponse(ApiOkResponse, CommentQueryDto, "Gets a comment")
  async Get(
    @Req() req: Request,
    @Param("contractId", ParseIntPipe) contractId: number,
    @Param("commentId", ParseIntPipe) commentId: number,
  ) {
    // @ts-ignore
    const accountId = req.user.account_id;
    return await this.commentService.Get(contractId, accountId, commentId);
  }

  @Post()
  @HttpCode(201)
  @ApiStandardResponse(ApiCreatedResponse, CommentQueryDto, "Creates a comment")
  async Create(
    @Req() req: Request,
    @Param("contractId", ParseIntPipe) contractId: number,
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    commentCreationDto: CommentCreationDto,
  ) {
    // @ts-ignore
    const accountId = req.user.account_id;
    // @ts-ignore
    const user = req.user.firstName;
    return await this.commentService.Create(contractId, accountId, user, commentCreationDto);
  }

  @Patch(":commentId")
  @HttpCode(200)
  @ApiStandardResponse(ApiOkResponse, CommentQueryDto, "Updates a comment")
  async Update(
    @Req() req: Request,
    @Param("contractId", ParseIntPipe) contractId: number,
    @Param("commentId", ParseIntPipe) commentId: number,
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    commentUpdateDto: CommentUpdateDto,
  ) {
    // @ts-ignore
    const accountId = req.user.account_id;
    return await this.commentService.Update(contractId, accountId, commentId, commentUpdateDto);
  }

  @Delete(":commentId")
  @HttpCode(204)
  @ApiStandardResponse(ApiNoContentResponse, null, "Deletes a comment")
  async Delete(
    @Req() req: Request,
    @Param("contractId") contractId: number,
    @Param("commentId") commentId: number,
  ): Promise<StandardResponse<{}>> {
    // @ts-ignore
    const accountId = req.user.account_id;
    return await this.commentService.Delete(contractId, accountId, commentId);
  }
}
