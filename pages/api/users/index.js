import { connectToDatabase } from "../../../lib/mongodb";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const { method } = req;

  const secret = process.env.JWT_SECRET_KEY;
  const token = req.headers.authorization;

  if (method === "POST") {
    try {
      if (
        await db.collection("users").findOne({ username: req.body.username })
      ) {
        return res.status(409).json({ conflict: "username already exists" });
      } else if (
        await db.collection("users").findOne({ email: req.body.email })
      ) {
        return res.status(409).json({ conflict: "email already in use" });
      } else {
        const { username, email } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Insert a document into the collection
        const newUser = await db.collection("users").insertOne({
          username: username,
          password: hashedPassword,
          email: email,
          createdAt: new Date(),
        });
        // Send a response
        return res.status(200).json({
          data: { username: req.body.username, email: req.body.email },
          message: "User added successfully",
          response: newUser,
        });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // get all users
  if (method === "GET") {
    try {
      var decoded = jwt.verify(token, secret);
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        error: error.message,
        message: "not authenticated",
        status: 401,
      });
    }
    if (decoded) {
      try {
        const users = await db.collection("users").find({}).toArray();
        return res.status(200).json(users);
      } catch (error) {
        console.log(error);
        return res.status(500).send();
      }
    }
  }

  // update number of posts user
  if (method === "PUT") {
    try {
      var decoded = jwt.verify(token, secret);
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        error: error.message,
        message: "not authenticated",
        status: 401,
      });
    }
    if (decoded) {
      try {
        const { username, numPosts } = req.body;
        const user = await db
          .collection("users")
          .updateOne({ username: username }, { $set: { numPosts: numPosts } });
        return res.status(200).json(user);
      } catch (error) {
        console.log(error);
        return res.status(500).send();
      }
    }
  }
}
