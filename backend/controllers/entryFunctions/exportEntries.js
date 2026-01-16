const Entry = require("../../models/EntryModel");

module.exports = async function exportEntries(req, res) {
  // check if user is there
  const userId = req.user.id;
  if (!userId) {
    return res.status(400).json({ msg: "No user ID received." });
  }

  // get all entries
  const entries = await Entry.find({ userId })
    .select("-__v -updatedAt -nextRevisionDate -_id -userId") // dont return these fields: __v, updatedAt, etc.
    .lean(); // .lean() returns plain JS objects, not Mongoose docs

  // simply return
  return res.status(200).json({ msg: "Export successful!", entries });
};
