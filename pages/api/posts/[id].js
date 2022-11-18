import { connectToDatabase } from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
const jwt = require("jsonwebtoken");

export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const { method } = req;
  const { id } = req.query;
  const token = req.headers.authorization;
  const secret = process.env.JWT_SECRET_KEY;

  jwt.verify(token, secret, async function (err, decoded) {
    if (!err && decoded) {
      if (method === "GET") {
        const post = await db
          .collection("posts")
          .findOne({ _id: new ObjectId(id) });

        if (!post) {
          return res.status(400).json("Post not found");
        }
        return res.status(200).json(post);
      }
    }
    console.log("unauthorized");
    return res.status(401).json({ status: 401, message: "unauthorized" });
  });
}
