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
    return response.status(200).json(user);
  }
}