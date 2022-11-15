const jwt = require("jsonwebtoken");

export default async function handler(req, res) {
  const secret = process.env.JWT_SECRET_KEY;
  const token = req.headers.authorization;

  jwt.verify(token, secret, async function (err, decoded) {
    if (!err && decoded) {
      return await fn(req, res);
    }
    res.status(500).json({ message: "not authenticated" });
  });
}
