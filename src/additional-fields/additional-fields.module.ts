import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Contract } from "src/contract/models/contract.entity";
import { ContractType } from "./../contractType/models/contractType.entity";
import { AdditionalFields } from "src/additional-fields/model/additional-fields.entity";
import { AdditionalFieldsService } from "src/additional-fields/additional-fields.service";
import { AdditionalFieldsController } from "src/additional-fields/additional-fields.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Contract, AdditionalFields, ContractType])],
  controllers: [AdditionalFieldsController],
  providers: [AdditionalFieldsService],
})
export class AdditionalFieldsModule {}
