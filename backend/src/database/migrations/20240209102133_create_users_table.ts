import { Knex } from "knex";

//just an example migration
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("username").notNullable().unique();
    table.text("password").notNullable();
    table.text("refreshToken");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users");
}
