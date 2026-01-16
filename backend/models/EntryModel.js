const mongoose = require("mongoose");

const entrySchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    word: {
      type: String,
      required: true, // imperative
    },
    language: {
      type: String,
      required: true, // imperative
    },
    translation: {
      type: String,
      required: true, // imperative
    },
    definition: {
      type: String,
      required: false,
      default: "",
    },
    category: {
      type: String,
      required: false,
      default: "",
    },
    img: {
      type: String,
      required: false,
      default: "",
    },
    example: {
      type: String,
      required: false,
      default: "",
    },
    note: {
      type: String,
      required: false,
      default: "",
    },
    nextRevisionDate: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("langcoach_entry", entrySchema);
