const { Redis } = require("ioredis");
require("dotenv").config();

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

function getExpiredTokenKey(token) {
  return `expired_token:${token}`;
}

async function setExpiredToken(token, seconds) {
  return await redisClient.set(getExpiredTokenKey(token), "1", "EX", seconds);
}

async function isTokenExpired(token) {
  return await redisClient.exists(getExpiredTokenKey(token));
}

module.exports = { redisClient, setExpiredToken, isTokenExpired };
