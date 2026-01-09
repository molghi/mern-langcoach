const mongoose = require("mongoose");
const Entry = require("../../models/EntryModel");

module.exports = async function deleteOneEntry(req, res) {
  if (!req.query.id) {
    return res.status(400).json({ msg: "No ID passed." });
  }

  if (!mongoose.Types.ObjectId.isValid(req.query.id)) {
    return res.status(400).json({ msg: "Invalid ID passed." });
  }

  try {
    const deletedDoc = await Entry.findByIdAndDelete(req.query.id);

    return res.status(200).json({ msg: "Deleted successfully!", deletedDoc });
  } catch (error) {
    return res.status(400).json({ msg: "Some error happened.", error });
  }
};
