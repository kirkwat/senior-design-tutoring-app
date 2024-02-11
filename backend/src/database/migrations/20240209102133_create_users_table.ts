import { Knex } from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("user", (table) => {
    table.increments("id").primary();
    table.string("first_name").notNullable();
    table.string("last_name").notNullable();
    table.string("email").notNullable().unique();
    table.text("password").notNullable();
    table.string("profile_picture").notNullable();
    table.text("refreshToken");
    table.integer("role").notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("user");
}
