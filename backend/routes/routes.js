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
  updateRevisionDates,
  exportEntries,
  importEntries,
} = require("../controllers/EntryController");
const { signUp, logIn, logOut } = require("../controllers/UserController");
const auth = require("../middleware/auth");

// ============================================================================

// ENTRIES CRUD
// create new entry
router.post("/entries", auth, createNewEntry);

// get user entries
router.get("/entries", auth, getUserEntries);

// update one entry
router.patch("/entries", auth, updateOneEntry);

// delete one entry
router.delete("/entries", auth, deleteOneEntry);

//

// OTHER DB READING
// get what langs are added
router.get("/languages", auth, getAddedLangs);

// fetch practice rounds for practice
router.get("/practice", auth, getPracticeRounds);

// update entries after quiz finished
router.patch("/entries_quiz", auth, updateRevisionDates);

// do export
router.get("/export", auth, exportEntries);

// do import
router.post("/import", auth, importEntries);

//

// USER FUNCTIONS
// create a user
router.post("/signup", signUp);

// log user in
router.post("/login", logIn);

// log user out
router.get("/logout", auth, logOut);

// check if logged in or not -- redundant, auth does it
// router.get("/check-auth", checkAuth);

// ============================================================================

module.exports = router;
