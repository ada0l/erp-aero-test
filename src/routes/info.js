const { Router } = require("express");

const tryCatch = require("../try-catch");
const { auth } = require("../middlewares");

const infoRouter = Router();

infoRouter.get(
  "/",
  auth,
  tryCatch(async (req, res) => {
    const result = req.auth;
    return res.json({ result });
  }),
);

module.exports = infoRouter;
