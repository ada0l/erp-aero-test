const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const AppError = require("../error");
const { setExpiredToken } = require("../redis");
const repositories = require("../repositories");
const formatters = require("../formatters");

async function getByIdOrThrow(id) {
  const userDb = await repositories.users.getById(id);
  if (!userDb) {
    throw new AppError(404, "User not found");
  }
  return userDb;
}

async function hashPassword(password, rounds = 10) {
  const salt = await bcrypt.genSalt(rounds);
  return await bcrypt.hash(password, salt);
}

async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

function verifyRefresh(id, token) {
  try {
    const decoded = jwt.verify(token, "refreshSecret");
    return decoded.email === id || decoded.phone === id;
  } catch (error) {
    console.error(error);
    return false;
  }
}

function getAccessToken(payload) {
  return jwt.sign(payload, "accessSecret", { expiresIn: "10m" });
}

function getRefreshToken(payload) {
  return jwt.sign(payload, "refreshSecret", { expiresIn: "30m" });
}

async function signUp(user) {
  const userDb = await repositories.users.getById(user.email);
  if (userDb) {
    throw new AppError(400, "User already exists");
  }
  user.password = await hashPassword(user.password);
  return await repositories.users.createOne(user);
}

async function signIn(user) {
  const userDb = await getByIdOrThrow(user.id);
  const isValidPassword = await comparePassword(user.password, userDb.password);
  if (!isValidPassword) {
    throw new AppError(401, "Invalid password");
  }
  const payload = formatters.users.fromBD(userDb);
  const accessToken = getAccessToken(payload);
  const refreshToken = getRefreshToken(payload);
  return { accessToken, refreshToken };
}

async function refreshToken(id, refreshToken) {
  const userDb = await getByIdOrThrow(id);
  if (!verifyRefresh(id, refreshToken)) {
    throw new AppError(401, "Invalid token");
  }
  const payload = formatters.users.fromBD(userDb);
  const accessToken = getAccessToken(payload);
  return { accessToken };
}

async function logOut(token) {
  return await setExpiredToken(token, 10 * 60);
}

module.exports = { signIn, signUp, refreshToken, logOut };
