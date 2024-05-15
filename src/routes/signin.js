const { Router } = require("express");
const { validate, Joi } = require("express-validation");

const services = require("../services");
const tryCatch = require("../try-catch");

const signInRouter = Router();

const signInValidation = {
  body: Joi.object({
    id: Joi.alternatives()
      .try(
        Joi.string()
          .regex(/[0-9]{11}/)
          .required(),
        Joi.string()
          .regex(/[a-zA-Z0-9]{3,30}/)
          .required(),
      )
      .required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
  }),
};

signInRouter.post(
  "/",
  validate(signInValidation, {}, {}),
  tryCatch(async (req, res) => {
    const user = req.body;
    const result = await services.users.signIn(user);
    return res.json({ result });
  }),
);

const newTokenValidation = {
  body: Joi.object({
    id: Joi.alternatives()
      .try(
        Joi.string()
          .regex(/[0-9]{11}/)
          .required(),
        Joi.string()
          .regex(/[a-zA-Z0-9]{3,30}/)
          .required(),
      )
      .required(),
    refreshToken: Joi.string().required(),
  }),
};

signInRouter.post(
  "/new_token",
  validate(newTokenValidation, {}, {}),
  tryCatch(async (req, res) => {
    const { id, refreshToken } = req.body;
    const result = await services.users.refreshToken(id, refreshToken);
    return res.status(200).json({ result });
  }),
);

module.exports = signInRouter;
