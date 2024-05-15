const jwt = require("jsonwebtoken");

const AppError = require("../error");
const { isTokenExpired } = require("../redis");

module.exports = async (req, res, next) => {
  const token = req.get("Authorization") || req.get("Authorization");
  if (!token) {
    next(new AppError(400, "Token not found"));
  }
  if (await isTokenExpired(token)) {
    next(new AppError(400, "Token is blacklisted"));
  }
  try {
    const decoded = jwt.verify(token, "accessSecret");
    req.auth = decoded;
    next();
  } catch (err) {
    next(new AppError(400, "Token is invalid"));
  }
};
