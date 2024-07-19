const mongoose = require("mongoose");

const collectionName = "users";

const dataModel = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  middlename: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'Customer' }
});

module.exports = mongoose.model("User", dataModel);
