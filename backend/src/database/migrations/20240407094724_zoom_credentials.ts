import type { Knex } from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("zoom_credentials", (table) => {
    table.increments("id").primary();
    table.string("zoom_user_id").notNullable().unique();
    table.string("access_token");
    table.string("refresh_token");
    table.timestamp("last_updated").notNullable();
    table.integer("tutor_id").notNullable();
    table.foreign("tutor_id").references("user.id");
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("zoom");
}
