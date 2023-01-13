import { ApiProperty } from "@nestjs/swagger";
import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ContractType } from "./../../contractType/models/contractType.entity";

export class FieldQueryDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  accountId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  label: string;

  @ApiProperty()
  contractType: ContractType;

  @ApiProperty()
  status: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class FieldCreationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  label: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  contractTypeId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  status: string;
}

export class FieldUpdateDto extends PartialType(FieldCreationDto) {}
