const jwt = require("jsonwebtoken");

module.exports = async function auth(req, res, next) {
  // check existence
  const myToken = req.cookies.token;
  if (!myToken) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  // validate / check / verify
  try {
    const decoded = jwt.verify(myToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return res.status(400).json({ msg: "Unauthorized or something else.", error });
  }
};
