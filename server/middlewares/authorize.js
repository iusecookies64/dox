const jwt = require("jsonwebtoken");
const jwtPassword = process.env["JWT_SECRET"];
const { User } = require("../models/index");

async function authorizeUser(req, res, next) {
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, jwtPassword);
    const userDocument = await User.findOne({ username: decoded.username });
    if (!userDocument) {
      throw Error("unauthorized");
    }
    res.locals.userDocument = userDocument;
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
}

module.exports = authorizeUser;
