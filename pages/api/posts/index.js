import { connectToDatabase } from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
const jwt = require("jsonwebtoken");

export default async function handler(req, res, next) {
  const { db } = await connectToDatabase();
  const { method } = req;
  const token = req.headers.authorization;
  const secret = process.env.JWT_SECRET_KEY;

  // GET all the posts
  if (method === "GET") {
    if (!token) {
      return res.status(500).json({ message: "not authenticated" });
    }
    try {
      const posts = await db.collection("posts").find({}).toArray();
      return res.status(200).json(posts);
    } catch (error) {
      console.log(error);
      return res.status(500).send();
    }
  }

  if (method === "POST") {
    if (!token) {
      return res.status(500).json({ message: "not authenticated" });
    }
    const { title, content, category, duration, exercises, author } = req.body;
    // Insert a post into DB
    const response = await db.collection("posts").insertOne({
      author,
      title,
      content,
      category,
      duration,
      exercises,
      createdAt: new Date(),
    });
    // Send a response
    return res.status(200).json({
      data: req.body,
      message: "Post added successfully",
    });
  }

  if (method === "DELETE") {
    if (!token) {
      return res.status(500).json({ message: "not authenticated" });
    }
    const { id } = req.body;
    const response = await db
      .collection("posts")
      .deleteOne({ _id: new ObjectId(id) });
    return res.status(200).json({
      data: req.body,
      message: "Post deleted",
    });
  }
}
