import { connectToDatabase } from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
const jwt = require("jsonwebtoken");

export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const { method } = req;

  const token = req.headers.authorization;
  const secret = process.env.JWT_SECRET_KEY;

  if (method === "GET") {
    const posts = await db.collection("posts").find({}).toArray();
    res.status(200).json(posts);
  } else {
    jwt.verify(token, secret, async function (err, decoded) {
      if (!err && decoded) {
         if (method === "POST") {
           const { title, content, category, duration, exercises } = req.body;
           // Insert a document into the collection
           const response = db.collection("posts").insertOne({
             title,
             content,
             category,
             duration,
             exercises,
             createdAt: new Date(),
           });
           // Send a response
           res.status(200).json({
             data: req.body,
             message: "Post added successfully",
           });
         }

         // GET all the posts

         if (method === "DELETE") {
           const { id } = req.body;
           const response = await db
             .collection("posts")
             .deleteOne({ _id: new ObjectId(id) });
           res.status(200).json({
             data: req.body,
             message: "Post deleted",
           });
           console.log(id);
         }
      }
      res.status(401).json({ message: "not authenticated" });
    });

   
  }
}
