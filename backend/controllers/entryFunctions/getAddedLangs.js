const Entry = require("../../models/EntryModel");

module.exports = async function getAddedLangs(req, res) {
  // get what langs are added
  const languagesAdded = await Entry.aggregate([
    {
      $group: {
        _id: "$language", // group by language
      },
    },
  ]);

  return res.status(200).json({ msg: "Added languages returned.", languages: languagesAdded });
};
