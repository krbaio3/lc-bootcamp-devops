//Módulos
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const express = require("express"),
  app = express();

const LOCAL =
  process.env.NODE_ENV === "production"
    ? "http://topics-api:5000"
    : "http://localhost:5000";

app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  //Recuperar topics de la API
  const response = await fetch(`${LOCAL}/api/topics`);
  const topics = await response.json();

  res.render("index", { topics });
});

app.listen(3000, () => {
  console.log(`Server running on port 3000 with ${LOCAL}`);
});
