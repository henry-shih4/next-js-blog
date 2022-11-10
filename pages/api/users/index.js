import { connectToDatabase } from "../../../lib/mongodb";
// import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const { method } = req;

    if (method === "POST") {
      const { username, password, email } = req.body;
      // Insert a document into the collection
      const response = db.collection("users").insertOne({
        username,
        password,
        email,
        createdAt: new Date(),
      });
      // Send a response
      res.status(200).json({
        data: req.body,
        message: "User added successfully",
      });
    }

  // Send all the posts
  if (method === "GET") {
    const posts = await db.collection("users").find({}).toArray();
    res.status(200).json(posts);
  }
}
