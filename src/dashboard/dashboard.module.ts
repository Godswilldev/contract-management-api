import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Contract } from "src/contract/models/contract.entity";
import { DashboardService } from "src/dashboard/dashobard.service";
import { DashboardController } from "src/dashboard/dashboard.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Contract])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
