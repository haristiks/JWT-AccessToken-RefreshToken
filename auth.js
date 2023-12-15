require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");


app.use(express.json());

let refreshTokens = [];

app.post("/token", (req, res) => {

  //generating AccessToken using Refresh Token


  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken });
  });
});

app.delete("/logout", (req, res) => {

  //Deleting Refresh Token

  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

app.post("/login", (req, res) => {

  //Initial Login and getting Temporary AccessToken, RefreshToken


  const { username } = req.body;
  const user = { name: username };

  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);
  res.json({ accessToken, refreshToken });
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "150s" });
}

app.listen(6000, (error) => {
  if (error) {
    console.log(error);
  }
  console.log("server running on port 6000");
});
