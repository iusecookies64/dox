require("dotenv").config();
const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("node:http");
const cors = require("cors");
const { Document, User } = require("./models/index");
const jwt = require("jsonwebtoken");
const jwtPassword = process.env.JWT_SECRET;
const authorizeUser = require("./middlewares/authorize");
const socketHandler = require("./socket");

const port = process.env.PORT || 3000;
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: "*",
});

io.on("connection", socketHandler);

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json()); // req.body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.static("./public"));

app.post("/api/user/signin", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDocument = await User.findOne({ username, password });
    if (!userDocument) throw Error();

    const token = jwt.sign({ username }, jwtPassword);
    res.json({
      token,
      username: userDocument.username,
    });
    // signing user in
  } catch (err) {
    console.log(err);
    res.status(401).json({});
  }
});

app.post("/api/user/signup", async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const newUser = new User({ email, username, password });
    newUser.save();
    res.json({
      message: "Account Created Successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

app.get("/api/document/:id", authorizeUser, async (req, res) => {
  try {
    const { userDocument } = res.locals;
    const { id } = req.params;
    const documentObj = await Document.findById(id);
    if (!documentObj) throw Error();
    res.json(documentObj);
  } catch (err) {
    res.status(500).send("Document Not Found");
  }
});

app.get("/api/all-documents", authorizeUser, async (req, res) => {
  const { userDocument } = res.locals;
  await userDocument.populate("documents");
  res.json(userDocument.documents);
});

app.post("/api/document/create", authorizeUser, async (req, res) => {
  try {
    const data = req.body;
    const { userDocument } = res.locals;

    const document = new Document({
      title: "Untitled Document",
      data,
      owner: userDocument.username,
      editors: [userDocument.username],
    });

    userDocument.documents.unshift(document["_id"]);
    document.save();
    userDocument.save();
    res.json(document);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

app.post("/api/document/save", authorizeUser, async (req, res) => {
  const { documentId, data } = req.body;
  const documentObj = await Document.findById(documentId);
  documentObj.data = data;
  documentObj.save();
  res.send();
});

server.listen(port, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("Server Running On", port);
});

module.exports.io = io;
