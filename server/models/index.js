const mongoose = require("mongoose");
const fs = require("fs");

// Connect to MongoDB
// mongoose.connect(process.env.DATABASE_URL);
mongoose.connect("mongodb://localhost:27017/dox");

// user information
const userSchema = new mongoose.Schema({
  email: String,
  username: { type: String, unique: true },
  password: String,
  documents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }],
});

const documentSchema = mongoose.Schema({
  id: String,
  title: String,
  data: Object,
  owner: String,
  editors: [{ type: String }],
});

const User = mongoose.model("User", userSchema);
const Document = mongoose.model("Document", documentSchema);

module.exports = {
  Document,
  User,
};
