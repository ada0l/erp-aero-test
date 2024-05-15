const database = require("../database");

async function getById(id) {
  return await database
    .select()
    .from("files")
    .where("files.id", id)
    .then((rows) => rows.at(0));
}

async function getAll(list_size, page) {
  return await database
    .select()
    .from("files")
    .limit(list_size)
    .offset(list_size * (page - 1))
    .orderBy("id", "desc");
}

async function createOne(file) {
  return await database.insert(file).into("files");
}

async function deleteById(id) {
  await database.delete().from("files").where("files.id", id);
}

async function update(file) {
  return await database.update(file).into("files");
}

module.exports = { getById, getAll, createOne, deleteById, update };
