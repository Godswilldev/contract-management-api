import { ApiProperty } from "@nestjs/swagger";

export class ExternalType {}

export class User extends ExternalType {
  @ApiProperty()
  id: number = -1;

  @ApiProperty()
  firstname: string = "";

  @ApiProperty()
  lastname: string = "";

  @ApiProperty()
  account_type: string = "";

  @ApiProperty()
  user_role_id: string = "";

  @ApiProperty()
  company_id: number = -1;

  @ApiProperty()
  account_id: number = -1;

  @ApiProperty()
  username: string = "";

  @ApiProperty()
  phone_number: string = "";

  @ApiProperty()
  email: string = "";
}

export class Account extends ExternalType {
  @ApiProperty()
  id: number = -1;

  @ApiProperty()
  firstName: string = "";

  @ApiProperty()
  lastName: string = "";

  @ApiProperty()
  phoneNumber: string = "";

  @ApiProperty()
  role: string = "";
}
