import { HttpException } from "@nestjs/common";
import { getOneById } from "src/shared/externalQueries";
import { accounts, users } from "src/shared/externalTables";
import { Account, User } from "src/shared/externalTypes";
import { DataSource } from "typeorm";
import { ResponseManager } from "./responseManager";

export class Guard {
  static AgainstNullOrUndefined(value: any, name: string, error?: HttpException): void {
    if (value === null || value === undefined) {
      if (error) {
        throw error;
      }

      throw ResponseManager.BadRequestResponse(`${name} does not exist`);
    }
  }

  static async AgainstNullOrUndefinedAccount(
    accountDatasource: DataSource,
    accountId: number,
  ): Promise<Account> {
    const account = await getOneById<Account>(Account, accountDatasource, accounts, accountId);

    console.log(account);

    Guard.AgainstNullOrUndefined(account, "account");

    return account;
  }

  static async AgainstNullOrUndefinedUser(
    accountDatasource: DataSource,
    userId: number,
  ): Promise<User> {
    const user = await getOneById<User>(User, accountDatasource, users, userId);

    Guard.AgainstNullOrUndefined(user, "user");

    return user;
  }
}
