const { ValidationError } = require("express-validation");
const AppError = require("../error");

module.exports = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }
  console.log(err);
  return res.status(500).json({ message: "Internal server error" });
};
