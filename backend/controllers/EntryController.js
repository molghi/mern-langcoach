const createNewEntry = require("./entryFunctions/createNewEntry");

const getUserEntries = require("./entryFunctions/getUserEntries");

const updateOneEntry = require("./entryFunctions/updateOneEntry");

const deleteOneEntry = require("./entryFunctions/deleteOneEntry");

const getAddedLangs = require("./entryFunctions/getAddedLangs");

const getPracticeRounds = require("./entryFunctions/getPracticeRounds");

module.exports = { createNewEntry, getUserEntries, updateOneEntry, deleteOneEntry, getAddedLangs, getPracticeRounds };
