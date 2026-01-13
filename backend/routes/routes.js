"use strict";
const express = require("express");
const router = express.Router();
const {
  createNewEntry,
  getUserEntries,
  updateOneEntry,
  deleteOneEntry,
  getAddedLangs,
  getPracticeRounds,
} = require("../controllers/EntryController");

// ============================================================================

// create new entry
router.post("/entries", createNewEntry);

// get user entries
router.get("/entries", getUserEntries);

// update one entry
router.patch("/entries", updateOneEntry);

// delete one entry
router.delete("/entries", deleteOneEntry);

// get what langs are added
router.get("/languages", getAddedLangs);

router.get("/practice", getPracticeRounds);

// ============================================================================

module.exports = router;
