import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { ContractType } from "src/contractType/models/contractType.entity";

export class ClauseQueryDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  clauseType: string;

  @ApiProperty()
  contractType: ContractType;

  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ClauseCreationDto {
  @IsNumber()
  @ApiProperty()
  contractTypeId: number;

  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  clauseType: string;

  @IsString()
  @ApiProperty()
  content: string;
}

export class ClauseUpdateDto extends PartialType(ClauseCreationDto) {}
