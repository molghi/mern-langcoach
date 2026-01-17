const Entry = require("../../models/EntryModel");

module.exports = async function importEntries(req, res) {
  // receive data
  const entriesToImport = req.body.entries;

  // validate
  if (!entriesToImport) {
    return res.status(400).json({ msg: "Entries data missing." });
  }

  if (!Array.isArray(entriesToImport)) {
    return res.status(400).json({ msg: "Entries must be array." });
  }

  if (entriesToImport.length === 0) {
    return res.status(400).json({ msg: "No entries to import." });
  }

  // add necessary fields: userId, nextRevisionDate
  const finalArr = entriesToImport.map((entry) => {
    entry.userId = req.user.id;
    entry.nextRevisionDate = 0;
    return entry;
  });

  try {
    // import finalArr:
    // -- if db has this exact 'word' in this exact 'language', update it
    // -- otherwise, create it
    // ---> Mongoose's upsert: update if exists, insert if doesn’t
    // .findOneAndUpdate() in a loop works, but is inefficient for many entries -- .bulkWrite is better
    const operations = finalArr.map((entry) => ({
      updateOne: {
        filter: { word: entry.word, language: entry.language, userId: entry.userId }, // match: if all three here match, update - if not, create
        update: { $set: entry }, // set or update fields
        upsert: true, // insert if not found
      },
    }));

    await Entry.bulkWrite(operations); // single db request instead of many

    return res.status(200).json({ msg: "Import successful!" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ msg: "Some error happened.", error });
  }
};
