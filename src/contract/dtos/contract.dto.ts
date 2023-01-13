import { Account } from "src/shared/externalTypes";
import { ContractStatus } from "src/utils/contractStatues";
import { PaginationQueryDto } from "src/shared/global.dto";
import { FieldQueryDto } from "src/fields/models/field.dto";
import { ClauseQueryDto } from "src/clause/models/clause.dto";
import { CommentQueryDto } from "src/comment/models/comment.dto";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ComponentQueryDto } from "src/component/models/component.dto";
import { ContractTypeQueryDto } from "src/contractType/dtos/contractType.dto";
import { BusinessPartnerQueryDto } from "src/business-partners/dto/business-partner.dto";
import { AdditionalFieldsQueryDto } from "src/additional-fields/model/additional-fields.dto";
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateContractDto {
  // OVERVIEW
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional()
  intendedAccountHolder: string;

  @ApiProperty()
  @IsNotEmpty()
  originalCompany: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  referenceId: number;

  @ApiProperty()
  @IsNotEmpty()
  legalEntity: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  endDate: Date;

  @ApiProperty()
  @IsEnum(ContractStatus, {
    message:
      "Status must be one of the Following: Draft | In Progress | Published | Active | Executed | Pending",
  })
  status: ContractStatus;

  // TERM
  @ApiProperty()
  termType: string;

  @ApiProperty()
  @IsDateString()
  originalExpDate: Date;

  @ApiProperty()
  @IsDateString()
  effectiveDate: Date;

  @ApiProperty()
  @IsDateString()
  currentExpDate: Date;

  @ApiProperty()
  renewalInterval: number;

  @ApiProperty()
  termStatus: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  contractTypeId: number;

  @ApiProperty()
  @IsNumber()
  business_partnerId: number;
}

export class ContractQueryDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  intendedAccountHolder: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  accountId: number;

  @ApiProperty()
  createdById: number;

  @ApiProperty()
  modifiedById: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  termType: string;

  @ApiProperty()
  originalExpDate: Date;

  @ApiProperty()
  effectiveDate: Date;

  @ApiProperty()
  currentExpDate: Date;

  @ApiProperty()
  renewalInterval: number;

  @ApiProperty()
  termStatus: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  account: Account;

  @ApiProperty()
  version: string;

  @ApiProperty()
  contractType: ContractTypeQueryDto;

  @ApiProperty()
  business_partner: BusinessPartnerQueryDto;

  @ApiProperty()
  fields: FieldQueryDto[];

  @ApiProperty()
  clauses: ClauseQueryDto[];

  @ApiProperty()
  components: ComponentQueryDto[];

  @ApiProperty()
  comments: CommentQueryDto[];

  @ApiProperty()
  additionalFields: AdditionalFieldsQueryDto[];
}

export class QueryDto extends PaginationQueryDto {
  @IsString()
  @ApiPropertyOptional()
  @IsOptional()
  status: ContractStatus;
}

export class ContractQuery {
  @IsString()
  @ApiPropertyOptional()
  @IsOptional()
  status: ContractStatus;

  @IsNumber()
  @ApiPropertyOptional()
  page: number;

  @IsNumber()
  @ApiPropertyOptional()
  take: number;
}
