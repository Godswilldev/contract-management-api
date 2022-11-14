import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class ContractsPerHolderNameDto {
  @IsString()
  @ApiProperty()
  holderName: string;

  @IsNumber()
  @ApiProperty()
  count: number;
}

export class ContractAmountsPerHolderNameDto {
  @IsString()
  @ApiProperty()
  holderName: string;

  @IsNumber()
  @ApiProperty()
  amount: number;
}
