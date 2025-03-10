import { Knex } from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("user", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("email").notNullable().unique();
    table.text("password").notNullable();
    table.string("role").notNullable();
    table.text("refreshToken");
    table.string("profile_picture");
    table.string("bio");
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("user");
}
