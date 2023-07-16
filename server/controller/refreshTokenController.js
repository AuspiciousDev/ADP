const User = require("../model/User");
const jwt = require("jsonwebtoken");
const createToken = require("../helper/createToken");
const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  console.log(
    "🚀 ~ file: refreshTokenController.js:7 ~ handleRefreshToken ~ cookies",
    cookies
  );

  if (!cookies?.jwt) return res.status(401).json({ message: "No cookie!" });
  const refreshToken = cookies.jwt;
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return res.status(403).json({ message: "User not found!" }); //Forbidden

  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username)
      return res.status(403).json({ message: "User not matched!" });
    // const roles = Object.values(foundUser.roles);
    const username = foundUser.username;
    const userType = foundUser.userType;
    const firstName = foundUser.firstName;
    const lastName = foundUser.lastName;
    const imgURL = foundUser.imgURL;
    const userObject = {
      UserInfo: {
        username: username,
        userType: userType,
      },
    };
    const accessToken = createToken.access(userObject);
    res.json({ username, userType, accessToken, firstName, lastName, imgURL });
  });
};

module.exports = {
  handleRefreshToken,
};
