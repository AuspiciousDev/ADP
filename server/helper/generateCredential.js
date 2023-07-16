const crypto = require("crypto");
const wishPassword =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$";
const wishUsername = "0123456789";

const generateCredentials = {
  password: (length) => {
    return Array.from(crypto.randomFillSync(new Uint32Array(length)))
      .map((x) => wishPassword[x % wishPassword.length])
      .join("");
  },
  username: (length) => {
    return Array.from(crypto.randomFillSync(new Uint32Array(length)))
      .map((x) => wishUsername[x % wishUsername.length])
      .join("");
  },
};
module.exports = generateCredentials;
