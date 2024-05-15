const { Router } = require("express");
const { validate, Joi } = require("express-validation");

const services = require("../services");
const tryCatch = require("../try-catch");

const signUpRouter = Router();

const signUpValidation = {
  body: Joi.object({
    email: Joi.string().email().required(),
    phone: Joi.string()
      .regex(/[0-9]{11}/)
      .required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
  }),
};

signUpRouter.post(
  "/",
  validate(signUpValidation, {}, {}),
  tryCatch(async (req, res) => {
    const user = req.body;
    const result = await services.users.signUp(user);
    return res.json({ result });
  }),
);

module.exports = signUpRouter;
