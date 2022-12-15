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
        const response = db.collection("users").insertOne({
          username: username,
          password: hashedPassword,
          email: email,
          createdAt: new Date(),
        });
        // Send a response
        return res.status(200).json({
          data: { username: req.body.username, email: req.body.email },
          message: "User added successfully",
        });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // get all users
  if (method === "GET") {
    if (!token) {
      return res.status(500).json({ message: "not authenticated" });
    }
    const users = await db.collection("users").find({}).toArray();
    return res.status(200).json(users);
  }

  // update number of posts on user
  if (method === "PUT") {
    if (!token) {
      return res.status(500).json({ message: "not authenticated" });
    }
    const { username, numPosts } = req.body;
    const user = await db
      .collection("users")
      .update({ username: username }, { $set: { numPosts: numPosts } });
    return res.status(200).json(user);
  }

  // jwt.verify(token, secret, async function (err, decoded) {
  //   if (!err && decoded) {
  //   } else {
  //     return res.status(500).json({ message: "not authenticated" });
  //   }
  // });
}
