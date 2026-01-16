const Entry = require("../../models/EntryModel");

module.exports = async function updateRevisionDates(req, res) {
  const dataObj = req.body.data;

  if (!dataObj || Object.keys(dataObj).length === 0) {
    return res.status(400).json({ msg: "No data received." });
  }

  const userId = req.user.id;
  if (!userId) {
    return res.status(400).json({ msg: "No user ID." });
  }

  const idsArray = Object.keys(dataObj);

  try {
    for (const id of idsArray) {
      await Entry.findByIdAndUpdate(id, { nextRevisionDate: +dataObj[id] }); // cannot use forEach - it doesn't wait for promises
    }

    return res.status(200).json({ msg: "Entries updated!" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ msg: "Some error happened.", error });
  }
};
