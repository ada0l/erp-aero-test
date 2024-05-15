const { Router } = require("express");
const { validate, Joi } = require("express-validation");
const multer = require("multer");
const path = require("path");

const tryCatch = require("../try-catch");
const { auth } = require("../middlewares");
const services = require("../services");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./storage/`);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

const fileRouter = Router();

fileRouter.post(
  "/upload",
  auth,
  upload.fields([{ name: "file", maxCount: 1, required: true }]),
  tryCatch(async (req, res) => {
    if (!req.files) {
      return res.status(400).json({ message: "No files were uploaded." });
    }
    const result = await services.files.upload(req.auth.id, req.files.file[0]);
    return res.json({ result });
  }),
);

const listValidation = {
  query: Joi.object({
    list_size: Joi.number().positive().default(10), // .default(1) doesnt work here :(
    page: Joi.number().positive().required(),
  }),
};

fileRouter.get(
  "/list",
  auth,
  validate(listValidation, {}, {}),
  tryCatch(async (req, res) => {
    const result = await services.files.getList(
      req.query.list_size || 10,
      req.query.page,
    );
    return res.json({ result });
  }),
);

fileRouter.delete(
  "/delete/:id",
  auth,
  tryCatch(async (req, res) => {
    await services.files.del(req.auth.id, req.params.id);
    return res.json({ message: "File is deleted" });
  }),
);

fileRouter.get(
  "/:id",
  auth,
  tryCatch(async (req, res) => {
    const result = await services.files.get(req.params.id);
    return res.json({ result });
  }),
);

fileRouter.get(
  "/download/:id",
  tryCatch(async (req, res) => {
    const file = await services.files.get(req.params.id);
    const p = path.join(__dirname, "..", "..", "storage", file.path);
    return res.sendFile(p);
  }),
);

fileRouter.put(
  "/update/:id",
  auth,
  upload.fields([{ name: "file", maxCount: 1, required: true }]),
  tryCatch(async (req, res) => {
    if (!req.files) {
      return res.status(400).json({ message: "No files were uploaded." });
    }
    await services.files.update(req.auth.id, req.params.id, req.files.file[0]);
    return res.json({ message: "File is updated" });
  }),
);

module.exports = fileRouter;
