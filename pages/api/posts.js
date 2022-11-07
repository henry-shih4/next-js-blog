import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  // Send all the todos
  const posts = await db.collection("posts").find({}).toArray();
  res.status(200).json(posts);
}
