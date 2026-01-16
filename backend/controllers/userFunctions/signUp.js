const User = require("../../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = async function signUp(req, res) {
  // receive data
  const { email, password, passwordConfirm } = req.body;

  // check existence of received data
  if (!email.trim() || !password.trim() || !passwordConfirm.trim()) {
    return res.status(400).json({ msg: "Please fill out all fields!" });
  }

  // validate received data (3 steps)
  //   1) email must be valid email -- checked by Mongoose model
  //   2) pw must be 8 chars min
  if (password.trim().length < 8) {
    return res.status(400).json({ msg: "Password must be 8 chars min." });
  }
  //   3) pw's must match
  if (password.trim() !== passwordConfirm.trim()) {
    return res.status(400).json({ msg: "Passwords don't match." });
  }

  try {
    // hash pw
    const hashedPw = await bcrypt.hash(password.trim(), 10); // 10 = salt rounds

    // optional: slice name out of email
    const name = email.trim().split("@")[0];

    // make db entry
    const newUser = await User.create({ email: email.trim(), name, password: hashedPw });

    // sign jwt
    const token = jwt.sign(
      { id: newUser._id, email: foundUser.email }, // what to store in jwt
      process.env.JWT_SECRET, // additional encryption
      { expiresIn: "1d" } // set expiration time
    );

    // set jwt cookie
    res.cookie("token", token, {
      httpOnly: true, // unable to read on frontend
      secure: false, // while developing...
      sameSite: "lax", // while developing...
      maxAge: 24 * 60 * 60 * 1000, // set expiration time
      path: "/", // cookie will belong to as many urls on this domain as there are, not locked to a specific url
    });

    // return res
    return res.status(200).json({ msg: "User profile created!", email: newUser.email });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ msg: "Email already registered." });
    }
    return res.status(400).json({ msg: "Some error happened.", error });
  }
};
