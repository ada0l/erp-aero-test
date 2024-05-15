// Update with your config settings.
//
require("dotenv").config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const development = {
  client: "mysql2",
  connection: {
    database: process.env.MYSQL_DB,
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: "knex_migrations",
  },
};

exports.development = development;
exports.staging = development;
exports.production = development;
