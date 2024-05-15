const { production } = require("../knexfile");

module.exports = require("knex")(production);
