const Entry = require("../../models/EntryModel");

module.exports = async function getUserEntries(req, res) {
  try {
    let response;

    if (!req.query.filter || req.query.filter.includes("show_all")) {
      // get ALL user entries, newest first
      response = await Entry.find().sort({ createdAt: -1 });
    } else {
      // get CERTAIN user entries (filtered), newest first
      const [parameterKey, parameterValue] = req.query.filter.split("_");
      if (parameterKey === "language") {
        // fetch & filter by language
        response = await Entry.find({ language: parameterValue }).sort({ createdAt: -1 });
      } else if (parameterKey === "period") {
        // fetch & filter by period
        const [year, month] = parameterValue.split("-");
        const periodStart = new Date(year, month - 1, 1); // parameterValue = '2026-01'
        periodStart.setHours(0, 0, 0, 0);
        const periodEnd = new Date(year, month, 0);
        periodEnd.setHours(23, 59, 59, 999); // set hours to 23:59:59.999 to ensure full-day inclusion
        response = await Entry.find({
          createdAt: {
            $gte: periodStart,
            $lte: periodEnd,
          },
        }).sort({ createdAt: -1 });
      } else {
        // fetch & filter by category
        response = await Entry.find({ category: parameterValue }).sort({ createdAt: -1 });
      }
    }

    // get quick summary: what langs are added, when categories are added
    const languagesAdded = await Entry.aggregate([
      {
        $group: {
          _id: "$language", // group by language
          // language: { $first: "$language" }, // take the first value in each group
        },
      },
    ]);

    const categoriesAdded = await Entry.aggregate([
      {
        $group: {
          _id: "$category", // group by category
        },
      },
    ]);

    return res.status(200).json({ msg: "Entries returned!", entries: response, languagesAdded, categoriesAdded });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ msg: "Some error happened.", error });
  }
};
