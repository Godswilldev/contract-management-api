import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class PatchSpec {
  @ApiProperty({
    description: "The operation to perform",
    example: "replace",
  })
  @IsString()
  op: string;

  @ApiProperty({
    description: "The name of the field to update",
    example: "/name",
  })
  @IsString()
  path: string;

  @ApiProperty({
    description: "The value to update the field with",
    example: "New Name",
  })
  value: any;
}
