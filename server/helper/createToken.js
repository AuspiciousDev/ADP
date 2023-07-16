const jwt = require("jsonwebtoken");

const createToken = {
  activation: (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
      expiresIn: "15m",
    });
  },
  access: (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "30m",
    });
  },
  refresh: (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "3h",
    });
  },
};

module.exports = createToken;
