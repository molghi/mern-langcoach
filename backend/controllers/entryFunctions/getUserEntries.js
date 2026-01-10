const Entry = require("../../models/EntryModel");

module.exports = async function getUserEntries(req, res) {
  try {
    let response;
    const entriesPerPage = 5; // hardcoded
    const pageRequested = Number(req.query.page);

    if (!req.query.filter || req.query.filter.includes("show_all")) {
      // get ALL user entries, newest first
      response = await Entry.find()
        .sort({ createdAt: -1 })
        .skip((pageRequested - 1) * entriesPerPage) // skip this number of docs
        .limit(entriesPerPage); // limit output to this number of docs
    } else {
      // get CERTAIN user entries (filtered), newest first
      const [parameterKey, parameterValue] = req.query.filter.split("_");
      if (parameterKey === "language") {
        // fetch & filter by language
        response = await Entry.find({ language: parameterValue }).sort({ createdAt: -1 });
      } else if (parameterKey === "period") {
        // fetch & filter by period
        const [year, month] = parameterValue.split("-"); // parameterValue looks like '2026-01'
        const periodStart = new Date(year, month - 1, 1);
        periodStart.setHours(0, 0, 0, 0); // set hours to beginning of day
        const periodEnd = new Date(year, month, 0);
        periodEnd.setHours(23, 59, 59, 999); // set hours to end of day
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

    const allEntriesCount = await Entry.countDocuments();

    return res.status(200).json({
      msg: "Entries returned!",
      entries: response,
      languagesAdded,
      categoriesAdded,
      allEntriesCount,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ msg: "Some error happened.", error });
  }
};
