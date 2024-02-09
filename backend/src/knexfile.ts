import path from "path";
import { Knex } from "knex";

interface KnexConfig {
  [key: string]: Knex.Config;
}

const knexConfig: KnexConfig = {
  development: {
    client: "sqlite3",
    connection: {
      filename: path.resolve(__dirname, "database", "mydb.sqlite"),
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.resolve(__dirname, "database", "migrations"),
    },
    seeds: {
      directory: path.resolve(__dirname, "database", "seeds"),
    },
  },
};

export default knexConfig;
