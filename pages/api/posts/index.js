import { connectToDatabase } from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
const jwt = require("jsonwebtoken");

export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const { method } = req;
  const token = req.headers.authorization;
  const secret = process.env.JWT_SECRET_KEY;

  // GET all the posts
  if (method === "GET") {
    try {
      var decoded = jwt.verify(token, secret);
    } catch (error) {
      res.status(401).json({
        error: error.message,
        message: "not authenticated",
        status: 401,
      });
    }
    if (decoded) {
      try {
        const posts = await db.collection("posts").find({}).toArray();
        return res.status(200).json(posts);
      } catch (error) {
        console.log(error.message);
        return res.status(500).send();
      }
    }
  }

  if (method === "POST") {
    try {
      var decoded = jwt.verify(token, secret);
    } catch (error) {
      res.status(401).json({
        error: error.message,
        message: "not authenticated",
        status: 401,
      });
    }
    if (decoded) {
      try {
        const {
          title,
          content,
          category,
          duration,
          exercises,
          author,
          authorImage,
        } = req.body;
        // Insert a post into DB
        const response = await db.collection("posts").insertOne({
          author,
          title,
          content,
          category,
          duration,
          exercises,
          createdAt: new Date(),
          authorImage,
        });
        // Send a response
        return res.status(200).json({
          data: req.body,
          message: "Post added successfully",
          post: response.title,
        });
      } catch (error) {
        console.log(error.message);
        return res.status(500).send();
      }
    }
  }
  if (method === "DELETE") {
    try {
      var decoded = jwt.verify(token, secret);
    } catch (error) {
      res.status(401).json({
        error: error.message,
        message: "not authenticated",
        status: 401,
      });
    }
    if (decoded) {
      try {
        const { id } = req.body;
        const response = await db
          .collection("posts")
          .deleteOne({ _id: new ObjectId(id) });
        return res.status(200).json({
          data: req.body,
          message: "Post deleted",
          id: response,
        });
      } catch (error) {
        console.log(error.message);
        return res.status(500).send();
      }
    }
  }
}
