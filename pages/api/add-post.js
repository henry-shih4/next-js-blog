import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  // Take user input
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
