import { Repository } from "typeorm";
import { Guard } from "src/utils/guard";
import { Injectable } from "@nestjs/common";
import { Comment } from "./models/comment.entity";
import { Pagination } from "src/utils/pagination";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginationQueryDto } from "src/shared/global.dto";
import { Contract } from "src/contract/models/contract.entity";
import { ResponseManager, StandardResponse } from "src/utils/responseManager";
import { CommentCreationDto, CommentUpdateDto } from "src/comment/models/comment.dto";

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Contract) private readonly contractRepository: Repository<Contract>,
  ) {}

  async GetAll(contractId: number, accountId: number, paginationQueryDto: PaginationQueryDto) {
    const contract = await this.contractRepository.findOne({
      where: { id: contractId, accountId },
    });

    Guard.AgainstNullOrUndefined(contract, "contract");

    const pagination = new Pagination(paginationQueryDto);

    const comments = await this.commentRepository.find({
      where: { contract: { id: contractId, accountId } },
      ...pagination.GetPaginationDbQuery(),
    });

    const total = await this.commentRepository.count({
      where: { contract: { id: contractId, accountId } },
    });

    return ResponseManager.StandardResponse(
      "success",
      200,
      "retrieved all comments",
      comments,
      pagination.GetPaginationResult(total, comments.length),
    );
  }

  async Get(
    contractId: number,
    accountId: number,
    commentId: number,
  ): Promise<StandardResponse<Comment>> {
    const contract = await this.contractRepository.findOne({
      where: { id: contractId, accountId },
    });

    Guard.AgainstNullOrUndefined(contract, "contract");

    const comment = await this.commentRepository.findOne({
      where: { id: commentId, contract: { id: contractId, accountId } },
      relations: { contract: true },
    });

    Guard.AgainstNullOrUndefined(
      comment,
      "comment",
      ResponseManager.NotFoundResponse("comment not found", { commentId }),
    );

    return ResponseManager.StandardResponse("success", 200, "Comment Retrived", comment);
  }

  async Create(
    contractId: number,
    accountId: number,
    user: string,
    commentCreationDto: CommentCreationDto,
  ) {
    const contract = await this.contractRepository.findOne({
      where: { id: contractId, accountId },
    });

    Guard.AgainstNullOrUndefined(contract, "contract");

    const newComment = this.commentRepository.create({ contract, user, ...commentCreationDto });

    const savedComment = await this.commentRepository.save(newComment);

    return ResponseManager.StandardResponse("success", 201, "comment created", savedComment);
  }

  async Update(
    contractId: number,
    accountId: number,
    commentId: number,
    commentUpdateDto: CommentUpdateDto,
  ) {
    const contract = await this.contractRepository.findOne({
      where: { id: contractId, accountId },
    });

    Guard.AgainstNullOrUndefined(contract, "contract");

    const comment = await this.commentRepository.findOne({
      where: { id: commentId, contract: { id: contractId, accountId } },
    });

    Guard.AgainstNullOrUndefined(
      comment,
      "comment",
      ResponseManager.NotFoundResponse("comment not found", { commentId }),
    );

    const savedComment = await this.commentRepository.update(
      {
        id: commentId,
        contract: { id: contractId, accountId },
      },
      { ...commentUpdateDto },
    );

    return ResponseManager.StandardResponse("success", 200, "comment updated", savedComment);
  }

  // async partialUpdate(
  //   contractId: number,
  //   commentId: number,
  //   patchDocument: PatchSpec[],
  // ): Promise<StandardResponse<CommentQueryDto>> {
  //   const contract = await this.contractRepository.findOne({
  //     where: { id: contractId },
  //   });

  //   Guard.AgainstNullOrUndefined(contract, "contract");

  //   const comment = await this.commentRepository.findOne({
  //     where: { id: commentId, Contract: { id: contractId } },
  //   });

  //   Guard.AgainstNullOrUndefined(
  //     comment,
  //     "comment",
  //     ResponseManager.NotFoundResponse("comment not found", { commentId }),
  //   );

  //   const commentPatch = applyPatch(comment, patchDocument as Operation[]).newDocument;

  //   commentPatch.updatedAt = new Date();

  //   const patchedDocument = await this.commentRepository.save(commentPatch);
  //   return ResponseManager.StandardResponse(
  //     "success",
  //     200,
  //     "comment updated",
  //     this.mapper.map(patchedDocument, Comment, CommentQueryDto),
  //   );
  // }

  async Delete(
    contractId: number,
    accountId: number,
    commentId: number,
  ): Promise<StandardResponse<{}>> {
    const contract = await this.contractRepository.findOne({
      where: { id: contractId, accountId },
    });

    Guard.AgainstNullOrUndefined(contract, "contract");

    const comment = await this.commentRepository.findOne({
      where: { id: commentId, contract: { id: contractId, accountId } },
    });

    Guard.AgainstNullOrUndefined(
      comment,
      "comment",
      ResponseManager.NotFoundResponse("comment not found", { commentId }),
    );

    await this.commentRepository.remove(comment);

    return ResponseManager.StandardResponse("success", 204, "comment deleted", {});
  }
}
