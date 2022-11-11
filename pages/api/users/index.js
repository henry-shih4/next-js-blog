import { connectToDatabase } from "../../../lib/mongodb";
// import { ObjectId } from "mongodb";
const bcrypt = require("bcrypt");

export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const { method } = req;

  if (method === "POST") {
    try {
      if (
        await db.collection("users").findOne({ username: req.body.username })
      ) {
        res.status(409).json({ conflict: "username already exists" });
      } else if (
        await db.collection("users").findOne({ email: req.body.email })
      ) {
        res.status(409).json({ conflict: "email already in use" });
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
        res.status(200).json({
          data: { username: req.body.username, email: req.body.email },
          message: "User added successfully",
        });
      }
    } catch {
      res.status(500).send();
    }
  }

  // Send all the posts
  if (method === "GET") {
    const posts = await db.collection("users").find({}).toArray();
    res.status(200).json(posts);
  }
}
