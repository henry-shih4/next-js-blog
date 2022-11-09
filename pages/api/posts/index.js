import { connectToDatabase } from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const { method } = req;

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

  // Send all the posts
  if (method === "GET") {
    const posts = await db.collection("posts").find({}).toArray();
    res.status(200).json(posts);
  }

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
