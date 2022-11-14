import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Contract } from "src/contract/models/contract.entity";
import { Addendum } from "src/addendum/models/addendum.entity";
import { AddendumService } from "src/addendum/addendum.service";
import { AddendumController } from "src/addendum/addendum.controller";
import { ContractType } from "src/contractType/models/contractType.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Addendum, Contract, ContractType])],
  controllers: [AddendumController],
  providers: [AddendumService],
})
export class AddendumModule {}
