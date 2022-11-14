import { ApiProperty } from "@nestjs/swagger";
import { Contract } from "src/contract/models/contract.entity";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CommentQueryDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  user: string;

  @ApiProperty()
  contractId: Contract;
}

export class CommentCreationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  content: string;
}

export class CommentUpdateDto {
  @IsString()
  @ApiProperty()
  content: string;
}
