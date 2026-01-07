const Entry = require("../../models/EntryModel");

module.exports = async function getUserEntries(req, res) {
  try {
    const response = await Entry.find();
    return res.status(200).json({ msg: "Entries returned!", entries: response });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ msg: "Some error happened.", error });
  }
};
