import { DataSource } from "typeorm";
import { ExternalType } from "./externalTypes";

export const getOneById = async <T extends ExternalType>(
  c: new () => T,
  dataSource: DataSource,
  table: string,
  id: number,
): Promise<T> => {
  const firstUser = await dataSource.query(
    `SELECT ${Object.keys(new c()).join(", ")} FROM ${
      process.env.ACCOUNT_DATABASE_NAME
    }.${table} Where id = ${id}`,
  );

  return firstUser[0] as T;
};
