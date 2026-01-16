const Entry = require("../../models/EntryModel");

// ============================================================================

module.exports = async function getUserEntries(req, res) {
  try {
    let response = null;
    let entriesMatchingQuery = null;

    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ msg: "No user ID." });
    }

    if (!req.query.filter || req.query.filter.includes("show_all")) {
      // get ALL user entries, newest first
      [response, entriesMatchingQuery] = await fetchMain("all", req.query, response, entriesMatchingQuery, userId);
    } else {
      // get CERTAIN user entries (filtered), newest first
      [response, entriesMatchingQuery] = await fetchMain("filtered", req.query, response, entriesMatchingQuery, userId);
    }

    // get quick summary: what langs are added, when categories are added
    const languagesAdded = await Entry.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$language", // group by language
        },
      },
    ]);

    // get what categories are added
    const categoriesAdded = await Entry.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$category", // group by category
        },
      },
    ]);

    const allEntriesCount = await Entry.countDocuments({ userId }); // get total entries count

    if (!response) response = []; // safeguard

    return res.status(200).json({
      msg: "Entries returned!",
      entries: response,
      languagesAdded,
      categoriesAdded,
      allEntriesCount,
      entriesMatchingQueryCount: entriesMatchingQuery,
      email: req.user.email,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ msg: "Some error happened.", error });
  }
};

// ============================================================================

async function fetchMain(flag, reqQuery, response, entriesMatchingQuery, userId) {
  const entriesPerPage = 5; // hardcoded
  const pageRequested = Number(reqQuery.page);

  // ROUTE 1: fetch all entries
  if (flag === "all") {
    response = await Entry.find({ userId })
      .sort({ createdAt: -1 })
      .skip((pageRequested - 1) * entriesPerPage) // skip this number of docs
      .limit(entriesPerPage); // limit output to this number of docs

    entriesMatchingQuery = null;
  }

  // ROUTE 2: fetch filtered entries
  if (flag === "filtered") {
    const [parameterKey, parameterValue] = reqQuery.filter.split("_");

    if (parameterKey === "language") {
      // fetch & filter by language
      response = await Entry.find({ userId, language: parameterValue })
        .sort({ createdAt: -1 })
        .skip((pageRequested - 1) * entriesPerPage)
        .limit(entriesPerPage);

      entriesMatchingQuery = await Entry.countDocuments({ userId, language: parameterValue });
    }

    if (parameterKey === "category") {
      // fetch & filter by category
      response = await Entry.find({ userId, category: parameterValue })
        .sort({ createdAt: -1 })
        .skip((pageRequested - 1) * entriesPerPage)
        .limit(entriesPerPage);

      entriesMatchingQuery = await Entry.countDocuments({ userId, category: parameterValue });
    }

    if (parameterKey === "period") {
      // fetch & filter by period
      const [year, month] = parameterValue.split("-"); // parameterValue looks like '2026-01'
      const periodStart = new Date(year, month - 1, 1);
      periodStart.setHours(0, 0, 0, 0); // set hours to beginning of day
      const periodEnd = new Date(year, month, 0);
      periodEnd.setHours(23, 59, 59, 999); // set hours to end of day
      response = await Entry.find({
        userId,
        createdAt: {
          $gte: periodStart,
          $lte: periodEnd,
        },
      })
        .sort({ createdAt: -1 })
        .skip((pageRequested - 1) * entriesPerPage)
        .limit(entriesPerPage);

      entriesMatchingQuery = await Entry.countDocuments({
        userId,
        createdAt: {
          $gte: periodStart,
          $lte: periodEnd,
        },
      });
    }
  }

  return [response, entriesMatchingQuery];
}
