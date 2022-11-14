import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContractType } from "src/contractType/models/contractType.entity";
import { ContractTypeService } from "src/contractType/contractType.service";
import { ContractTypeController } from "src/contractType/contractType.controller";

@Module({
  imports: [TypeOrmModule.forFeature([ContractType])],
  providers: [ContractTypeService],
  controllers: [ContractTypeController],
})
export class ContractTypeModule {}
