const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl");
const port = process.env.PORT || 3000;
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/urlShortner", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls: shortUrls });
});

app.post("/shortUrls", async (req, res) => {
  await ShortUrl.create({ full: req.body.fullurl });
  res.redirect("/");
});

app.get("/:shortUrl",async (req,res) => {
  const shortUrl = await ShortUrl.findOne({short: req.params.shortUrl});
  if(shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save();

  res.redirect(shortUrl.full)
})

app.listen(port, () => console.log("server is up at 3000"));

