const Entry = require("../../models/EntryModel");

module.exports = async function createNewEntry(req, res) {
  // receive data
  const { word, language, translation, definition, category, img, example, note } = req.body;

  const userId = req.user.id;
  if (!userId) {
    return res.status(400).json({ msg: "No user ID." });
  }

  // if crucial fields (word, language, translation) empty, return error
  if (!word.toString().trim() || !language.toString().trim() || !translation.toString().trim()) {
    return res.status(400).json({ msg: "Fields - word, language, translation - cannot be empty." });
  }

  // validate: done above

  // db insert & return res
  try {
    const insertedDoc = await Entry.create({
      userId,
      word,
      language,
      translation,
      definition,
      category,
      img,
      example,
      note,
    });
    return res.status(200).json({ msg: "Entry created!", insertedDoc });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ msg: "Some error happened.", error });
  }
};
