import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Comment } from "src/comment/models/comment.entity";
import { CommentService } from "src/comment/comment.service";
import { Contract } from "src/contract/models/contract.entity";
import { CommentController } from "src/comment/comment.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Contract])],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
