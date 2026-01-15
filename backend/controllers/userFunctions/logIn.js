const User = require("../../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = async function logIn(req, res) {
  // receive data
  const { email, password } = req.body;

  // check existence
  if (!email.trim() || !password.trim()) {
    return res.status(400).json({ msg: "Please fill out all fields!" });
  }

  // validate:
  //   - email must be valid email -- Mongoose model handles it
  //   - pw must not be empty/falsy
  if (!email.trim() || !password.trim()) {
    return res.status(400).json({ msg: "Please fill out all fields!" });
  }
  //   - email must exist in db
  try {
    const foundUser = await User.findOne({ email: email.trim() }); // find user by email which is unique

    if (!foundUser) {
      return res.status(400).json({ msg: "Invalid credentials." });
    }

    //   - pw's must match
    const passwordsMatch = await bcrypt.compare(password, foundUser.password);

    if (!passwordsMatch) {
      return res.status(400).json({ msg: "Invalid credentials." });
    }

    // sign jwt
    const token = jwt.sign(
      { id: foundUser._id }, // token content
      process.env.JWT_SECRET, // extra encryption
      { expiresIn: "1d" } // set exp. time
    );

    // set jwt cookie
    res.cookie("token", token, {
      httpOnly: true, // unable to read on frontend
      secure: false, // dev only
      sameSite: "lax", // dev only
      maxAge: 24 * 60 * 60 * 1000, // set exp. time
      path: "/", // to work on many paths
    });

    // return 200
    return res.status(200).json({ msg: "Logged in successfully!", email: foundUser.email });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ msg: "Some error happened.", error });
  }
};
