const fs = require("fs");

const AppError = require("../error");
const repositories = require("../repositories");
const formatters = require("../formatters");

async function getByIdOrThrow(id) {
  const file = await repositories.files.getById(id);
  if (!file) {
    throw new AppError(404, "File not found");
  }
  return file;
}

async function upload(userId, file) {
  const id = await repositories.files
    .createOne({
      name: file.originalname,
      extension: file.originalname.split(".").pop(),
      mime: file.mimetype,
      size: file.size,
      user_id: userId,
      path: file.filename,
    })
    .then((ids) => ids[0]);
  const fileDB = await repositories.files.getById(id);
  return formatters.files.fromDB(fileDB);
}

async function getList(listSize, page) {
  return await repositories.files
    .getAll(listSize, page)
    .then((files) => files.map((file) => formatters.files.fromDB(file)));
}

async function del(userId, fileId) {
  const fileDB = await getByIdOrThrow(fileId);
  if (fileDB.user_id !== userId) {
    throw new AppError(403, "Forbidden");
  }
  return await repositories.files.deleteById(fileId).then(() => {
    fs.rm(`./storage/${fileDB.path}`, (err) => {
      if (err) {
        console.log(err);
        throw new AppError(500, "Internal server error");
      }
    });
  });
}

async function get(fileId) {
  const fileDB = await getByIdOrThrow(fileId);
  return formatters.files.fromDB(fileDB);
}

async function update(userId, fileId, file) {
  const fileDB = await getByIdOrThrow(fileId);
  if (fileDB.user_id !== userId) {
    throw new AppError(403, "Forbidden");
  }
  return await repositories.files
    .update({
      id: file.id,
      name: file.originalname,
      extension: file.originalname.split(".").pop(),
      mime: file.mimetype,
      size: file.size,
      user_id: userId,
      path: file.filename,
    })
    .then((status) => {
      fs.rm(`./storage/${fileDB.path}`, (err) => {
        if (err) {
          console.log(err);
          throw new AppError(500, "Internal server error");
        }
      });
      return status;
    });
}

module.exports = { upload, getList, del, get, update };
