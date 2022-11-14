import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Clause } from "src/clause/models/clause.entity";
import { ClauseService } from "src/clause/clause.service";
import { ClauseController } from "src/clause/clause.controller";
import { ContractType } from "src/contractType/models/contractType.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Clause, ContractType])],
  providers: [ClauseService],
  controllers: [ClauseController],
})
export class ClauseModule {}
