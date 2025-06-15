import express from "express";
import https from "https";

const app = express();

app.get("/login", (req, res) => res.send("1147329"));

app.get("/id/:N", (req, res) => {
  const N = req.params.N;
  const url = `https://nd.kodaktor.ru/users/${N}`;

  const options = {
    method: "GET",
    headers: {} // Пустые заголовки — не добавляем Content-Type
  };

  https.get(url, options, (resp) => {
    let data = "";

    resp.on("data", (chunk) => data += chunk);
    resp.on("end", () => {
      try {
        const json = JSON.parse(data);
        res.send(json.login || "no login");
      } catch (e) {
        res.status(500).send("Invalid JSON");
      }
    });
  }).on("error", (err) => {
    res.status(500).send("Request failed");
  });
});

// Порт для Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
