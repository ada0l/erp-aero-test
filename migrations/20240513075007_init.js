/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
async function up(knex) {
  await knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("phone").notNullable().unique();
    table.string("email").notNullable().unique();
    table.string("password").notNullable();
  });
  await knex.schema.createTable("files", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("extension").notNullable();
    table.string("mime").notNullable();
    table.bigint("size").notNullable();
    table.dateTime("created_at").defaultTo(knex.fn.now());
    table.string("path").notNullable();
    table.integer("user_id").unsigned().notNullable();
    table.foreign("user_id").references("users.id");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
async function down(knex) {
  await knex.schema.dropTable("users");
}

module.exports = { up, down };
