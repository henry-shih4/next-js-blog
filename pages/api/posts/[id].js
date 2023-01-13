import { connectToDatabase } from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
const jwt = require("jsonwebtoken");

export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const { method } = req;
  const { id } = req.query;
  const token = req.headers.authorization;
  const secret = process.env.JWT_SECRET_KEY;

  if (method === "GET") {
    try {
      var decoded = jwt.verify(token, secret);
    } catch (error) {
      console.log(error);
    }
    if (decoded) {
      const post = await db
        .collection("posts")
        .findOne({ _id: new ObjectId(id) });

      if (!post) {
        return res.status(400).json("Post not found");
      }
      return res.status(200).json(post);
    }
  }

  if (method === "PUT") {
    try {
      var decoded = jwt.verify(token, secret);
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        error: error.message,
        message: "not authenticated",
        status: 401,
      });
    }
    if (decoded) {
      try {
        if (req.body.type == "comment") {
          const { username, comment } = req.body;
          const user = await db.collection("posts").updateOne(
            { _id: new ObjectId(id) },
            {
              $push: {
                comments: { username: username, comment: comment },
              },
            }
          );
          return res.status(200).json(user);
        }

        const { username } = req.body;
        const post = await db.collection("posts").findOne({
          _id: new ObjectId(id),
          likedBy: { $in: [username] },
        });

        if (post) {
          const user = await db
            .collection("posts")
            .updateOne(
              { _id: new ObjectId(id) },
              { $pull: { likedBy: username } }
            );
          return res.status(200).json(user);
        }
        const user = await db
          .collection("posts")
          .updateOne(
            { _id: new ObjectId(id) },
            { $push: { likedBy: username } }
          );
        return res.status(200).json(user);
      } catch (error) {
        console.log(error);
        return res.status(500).send();
      }
    }
  }
}
