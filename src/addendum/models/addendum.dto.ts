import { ApiProperty } from "@nestjs/swagger";
import { Contract } from "src/contract/models/contract.entity";
import { ContractType } from "src/contractType/models/contractType.entity";
import { IsDate, IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AddendumCreationDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  contractId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  contractTypeId: number;

  @IsString()
  @ApiProperty()
  expirationEmail: string;

  @IsString()
  @ApiProperty()
  @IsDateString()
  expirationDate: Date;

  @IsString()
  @ApiProperty()
  @IsDateString()
  effectiveDate: Date;
}

export class AddendumUpdateDto {
  @IsString()
  @ApiProperty()
  expirationEmail: string;

  @IsString()
  @ApiProperty()
  @IsDateString()
  expirationDate: Date;

  @IsString()
  @ApiProperty()
  @IsDateString()
  effectiveDate: Date;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  contractTypeId: number;
}

export class AddendumQueryDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  expirationEmail: string;

  @ApiProperty()
  contract: Contract;

  @ApiProperty()
  contractType: ContractType;

  @ApiProperty()
  effectiveDate: Date;

  @ApiProperty()
  expirationDate: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
