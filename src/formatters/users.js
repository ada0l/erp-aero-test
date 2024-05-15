function fromBD(user) {
  const { password, ...restUser } = user;
  return restUser;
}

module.exports = { fromBD };
