import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BusinessPartner } from "src/business-partners/entities/business-partner.entity";
import { BusinessPartnersService } from "src/business-partners/business-partners.service";
import { BusinessPartnersController } from "src/business-partners/business-partners.controller";

@Module({
  imports: [TypeOrmModule.forFeature([BusinessPartner])],
  controllers: [BusinessPartnersController],
  providers: [BusinessPartnersService],
})
export class BusinessPartnersModule {}
