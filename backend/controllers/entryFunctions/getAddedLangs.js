const { default: mongoose } = require("mongoose");
const Entry = require("../../models/EntryModel");

module.exports = async function getAddedLangs(req, res) {
  // get what langs are added
  const userId = req.user.id;
  if (!userId) {
    return res.status(400).json({ msg: "No user ID." });
  }

  const languagesAdded = await Entry.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: "$language", // group by language
      },
    },
  ]);

  return res.status(200).json({ msg: "Added languages returned.", languages: languagesAdded });
};
