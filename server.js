"use strict";
const express = require("express");
const morgan = require("morgan");

const { top50 } = require("./data/top50");

const PORT = process.env.PORT || 8000;
const app = express();
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

const handler = (req, res) => {
  res.render("pages/top50", {
    title: "Top 50 Songs Streamed on Spotify",
    top50: top50,
    path: req.originalUrl,
  });
};
const handleSong = (req, res) => {
  const rank = req.params.rank - 1;
  if (top50[rank]) {
    res.render("pages/songPage", {
      title: "Song #" + top50[rank].rank,
      song: top50[rank],
    });
  } else {
    handleError(req, res);
  }
};
// endpoints here
app.get("/top50", handler);

app.get("/top50/song/:rank", handleSong);
// handle 404s

const handleError = (req, res) => {
  res.status(404);
  res.render("pages/fourOhFour", {
    title: "I got nothing",
    path: req.originalUrl,
  });
};
app.get("*", handleError);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
