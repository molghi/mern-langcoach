const mongoose = require("mongoose");
const Entry = require("../../models/EntryModel");

module.exports = async function updateOneEntry(req, res) {
  // receive data
  const { word, language, translation, definition, category, img, example, note } = req.body;

  // if crucial fields (word, language, translation) empty, return error
  if (!word.toString().trim() || !language.toString().trim() || !translation.toString().trim()) {
    return res.status(400).json({ msg: "Fields - word, language, translation - cannot be empty." });
  }

  // if (!req.body._id) {
  if (!mongoose.Types.ObjectId.isValid(req.body._id)) {
    return res.status(400).json({ msg: "No entry ID." });
  }

  // validate: done above

  // db insert & return res
  try {
    const updatedDoc = await Entry.findByIdAndUpdate(
      req.body._id,
      {
        word,
        language,
        translation,
        definition,
        category,
        img,
        example,
        note,
      },
      { new: true }
    );

    return res.status(200).json({ msg: "Entry updated!", updatedDoc });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ msg: "Some error happened.", error });
  }
};
