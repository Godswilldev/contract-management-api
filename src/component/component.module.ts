import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Contract } from "src/contract/models/contract.entity";
import { Component } from "src/component/models/component.entity";
import { ComponentService } from "src/component/component.service";
import { ComponentController } from "src/component/component.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Component, Contract])],
  providers: [ComponentService],
  controllers: [ComponentController],
})
export class ComponentModule {}
