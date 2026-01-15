module.exports = async function logOut(req, res) {
  if (!req.cookies.token) {
    return res.status(400).json({ msg: "There was no token cookie." });
  }

  // reset cookie
  res.cookie("token", "", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return res.status(200).json({ msg: "Logged out successfully!", email: "" });
};
