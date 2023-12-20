import { type MySql2Database, drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import mysql, { type Connection } from "mysql2";
import * as schema from "../db/schema/index.ts";

export default class MySQLCli {
  client: MySql2Database<any>;
  connection: Connection;

  constructor() {
    this.connection = mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      multipleStatements: true,
    });
    this.client = drizzle(this.connection, { schema, mode: "default" });
  }

  async migrate(): Promise<void> {
    await migrate(this.client, { migrationsFolder: "./drizzle" });
    this.connection.end();
  }
}
