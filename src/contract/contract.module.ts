import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Field } from "src/fields/models/field.entity";
import { Contract } from "src/contract/models/contract.entity";
import { ContractService } from "src/contract/contract.service";
import { Component } from "src/component/models/component.entity";
import { ContractController } from "src/contract/contract.controller";
import { ContractType } from "src/contractType/models/contractType.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Contract, ContractType, Component, Field])],
  providers: [ContractService],
  controllers: [ContractController],
})
export class ContractModule {}
