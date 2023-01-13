import { Guard } from "src/utils/guard";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";
import { ResponseManager } from "src/utils/responseManager";
import { StandardResponse } from "src/utils/responseManager";
import { BusinessPartner } from "src/business-partners/entities/business-partner.entity";
import {
  BusinessPartnerQueryDto,
  CreateBusinessPartnerDto,
  UpdateBusinessPartnerDto,
} from "src/business-partners/dto/business-partner.dto";

@Injectable()
export class BusinessPartnersService {
  constructor(
    @InjectRepository(BusinessPartner)
    private readonly businessPartnerRepository: Repository<BusinessPartner>,
  ) {}
  async create(
    accountId: number,
    createBusinessPartnerDto: CreateBusinessPartnerDto,
  ): Promise<StandardResponse<BusinessPartnerQueryDto>> {
    const businessPartner = this.businessPartnerRepository.create({
      accountId,
      ...createBusinessPartnerDto,
    });

    const savedBusinessPartner = await this.businessPartnerRepository.save(businessPartner);

    return ResponseManager.StandardResponse(
      "success",
      201,
      "Business Partner Created Successfully",
      savedBusinessPartner,
    );
  }

  async findAll(accountId: number): Promise<StandardResponse<BusinessPartnerQueryDto[]>> {
    const businessPartners = await this.businessPartnerRepository.find({ where: { accountId } });
    return ResponseManager.StandardResponse(
      "success",
      200,
      "Business Partners Found",
      businessPartners,
    );
  }

  async findOne(accountId: number, id: number): Promise<StandardResponse<BusinessPartnerQueryDto>> {
    const businessPartners = await this.businessPartnerRepository.findOne({
      where: { accountId, id },
    });

    Guard.AgainstNullOrUndefined(businessPartners, "Business Partner");

    return ResponseManager.StandardResponse(
      "success",
      200,
      "Business Partner Found",
      businessPartners,
    );
  }

  async update(
    accountId: number,
    id: number,
    updateBusinessPartnerDto: UpdateBusinessPartnerDto,
  ): Promise<StandardResponse<UpdateResult>> {
    const businessPartner = await this.businessPartnerRepository.findOne({
      where: { accountId, id },
    });

    Guard.AgainstNullOrUndefined(businessPartner, "Business Partner");

    const businessPartners = await this.businessPartnerRepository.update(
      { accountId, id },
      { ...updateBusinessPartnerDto },
    );

    return ResponseManager.StandardResponse(
      "success",
      201,
      "Business Partner Updated",
      businessPartners,
    );
  }

  async remove(accountId: number, id: number) {
    const businessPartners = await this.businessPartnerRepository.findOne({
      where: { accountId, id },
    });

    Guard.AgainstNullOrUndefined(businessPartners, "Business Partner");

    await this.businessPartnerRepository.delete({ accountId, id });

    return ResponseManager.StandardResponse("success", 204, "Business Partner Deleted", {});
  }
}
