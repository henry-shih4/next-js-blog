import { connectToDatabase } from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(request, response) {
  const { db } = await connectToDatabase();
  const { method } = request;
  const { id } = request.query;
  if (method === "GET") {
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) });

    if (!user) {
      return response.status(400).json("user not found");
    }
    return response
      .status(200)
      .json({
        username: user.username,
        email: user.email,
        photoURL: user.photoURL,
        userId: user.userId,
        createdAt: user.createdAt,
        numPosts: user.numPosts,
      });
  }

  if (method === "PUT") {
    try {
      const { username, photoURL } = request.body;
      const user = await db
        .collection("users")
        .updateOne({ username: username }, { $set: { photoURL: photoURL } });
      return response.status(200).json(user);
    } catch (error) {
      console.log(error);
    }
  }
}
