import { connectToDatabase } from "../../../lib/mongodb";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

export default async function handler(req, res) {
  const { method } = req;
  if (method === "POST") {
    const { db } = await connectToDatabase();
    const { username, password } = req.body;
    const user = await db.collection("users").findOne({ username: username });
    if (user === null) {
      return res.send({ message: "username not found" });
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign(
          {
            username: user.username,
            userId: user._id,
          },
          "RANDOM-TOKEN",
          { expiresIn: "24h" }
        );
        return res.send({
          message: "Login Successful",
          username: user.username,
          userId: user._id,
          token,
        });
      } else if (!(await bcrypt.compare(password, user.password))) {
        return res.send({ message: "username or password incorrect" });
      }
    } catch (error) {
      console.log(error);
      return res.send({ message: "error" });
    }
  }
}
