import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsNumber } from "class-validator";

export class PaginationQueryDto {
  @IsNumber()
  @ApiPropertyOptional()
  page: number;

  @IsNumber()
  @ApiPropertyOptional()
  take: number;

  @IsDate()
  @ApiPropertyOptional()
  fromDate: string;

  @IsDate()
  @ApiPropertyOptional()
  toDate: string;
}

export class ContractTypeIdDto {
  @IsNumber()
  @ApiPropertyOptional()
  contractTypeId: number;
}
