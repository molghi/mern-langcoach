const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    // id is auto-created
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"], // check that submitted email is valid email
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
