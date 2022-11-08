import { connectToDatabase } from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(request, response) {
  const { db } = await connectToDatabase();
  const { method } = request;
  const { id } = request.query;

  if (method === "GET") {
    const post = await db
      .collection("posts")
      .findOne({ _id: new ObjectId(id) });

    if (!post) {
      return response.status(400).json("Post not found");
    }
    return response.status(200).json(post);
  }
}
