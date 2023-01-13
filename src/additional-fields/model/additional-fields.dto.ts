import { ApiProperty } from "@nestjs/swagger";
import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Contract } from "src/contract/models/contract.entity";
import { ContractType } from "src/contractType/models/contractType.entity";

export class AdditionalFieldsCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  value: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  contractId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  contractTypeId: number;
}

export class AdditionalFieldsQueryDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  accountId: number;

  @ApiProperty()
  contract: Contract;

  @ApiProperty()
  contractType: ContractType;

  @ApiProperty()
  value: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class AdditionalFieldsUpdateDto extends PartialType(AdditionalFieldsCreateDto) {}
