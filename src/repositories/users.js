const database = require("../database");

async function getById(id) {
  return await database
    .select()
    .from("users")
    .where("phone", id)
    .orWhere("email", id)
    .limit(1)
    .then((rows) => rows.at(0));
}

async function createOne(newUser) {
  return await database.insert(newUser).into("users");
}

module.exports = { getById, createOne };
