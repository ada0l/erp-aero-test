const { Router } = require("express");

const services = require("../services");
const tryCatch = require("../try-catch");

const logOutRouter = Router();

logOutRouter.post(
  "/",
  tryCatch(async (req, res) => {
    let token = req.get("authorization");
    await services.users.logOut(token);
    return res.json({ message: "Logged out" });
  }),
);

module.exports = logOutRouter;
