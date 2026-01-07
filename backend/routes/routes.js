"use strict";
const express = require("express");
const router = express.Router();
const { createNewEntry, getUserEntries } = require("../controllers/EntryController");

// ============================================================================

router.post("/entries", createNewEntry);

router.get("/entries", getUserEntries);

// ============================================================================

module.exports = router;
