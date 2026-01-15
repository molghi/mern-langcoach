module.exports = async function checkAuth(req, res) {
  if (!req.cookies.token) {
    return res.status(401).json({ msg: "Unauthorized" });
  }
};
