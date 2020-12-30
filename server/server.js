const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("../client"));

app.get((req, res) => {
  res.status(200).sendFile("index.html");
});

app.listen(8080, () => {
  console.log("server running on port 8080");
});
