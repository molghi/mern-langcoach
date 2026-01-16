const { default: mongoose } = require("mongoose");
const Entry = require("../../models/EntryModel");

module.exports = async function getPracticeRounds(req, res) {
  const practiceLanguage = req.query.language;
  const numberOfRounds = 5; // =number of entries returned

  if (!practiceLanguage) {
    return res.status(400).json({ msg: "Practice language not set." });
  }

  const userId = req.user.id;
  if (!userId) {
    return res.status(400).json({ msg: "No user ID." });
  }

  const now = new Date();

  try {
    // return x random entries of y language
    const response = await Entry.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          language: practiceLanguage, // match language
          // nextRevisionDate must be either right now or in the past or undefined:
          $or: [{ nextRevisionDate: { $lte: now } }, { nextRevisionDate: { $exists: false } }, { nextRevisionDate: 0 }],
        },
      },
      { $sample: { size: numberOfRounds } }, // $sample returns random documents & requires an aggregation pipeline
    ]);

    return res.status(200).json({ msg: "Practice rounds returned.", rounds: response, language: practiceLanguage });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ msg: "Some error happened.", error });
  }
};
