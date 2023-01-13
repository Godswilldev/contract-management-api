import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Field } from "src/fields/models/field.entity";
import { Contract } from "src/contract/models/contract.entity";
import { ContractService } from "src/contract/contract.service";
import { Component } from "src/component/models/component.entity";
import { ContractController } from "src/contract/contract.controller";
import { ContractType } from "src/contractType/models/contractType.entity";
import { ClauseTemplates } from "src/clause/models/clauseFiles.entity";
import { BusinessPartner } from "src/business-partners/entities/business-partner.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Contract,
      BusinessPartner,
      ClauseTemplates,
      ContractType,
      Component,
      Field,
    ]),
  ],
  providers: [ContractService],
  controllers: [ContractController],
})
export class ContractModule {}
