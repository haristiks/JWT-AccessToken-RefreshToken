require("dotenv").config();
const express = require("express");
const app = express();

const jwt = require("jsonwebtoken");

//.......

const posts = [
  {
    username: "Haris",
    title: "Fullstack",
  },
  {
    username: "Dilshad",
    title: "Frpntend",
  },
];

app.use(express.json());


app.get("/posts", authVerify, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.name));
});

function authVerify(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

//
//

app.listen(5000, (error) => {
  if (error) {
    console.log(error);
  }
  console.log("server running on port 5000");
});
