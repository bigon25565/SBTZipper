import express from "express";
import Busboy from "busboy";
import crypto from "crypto";

const app = express();

app.get("/login", (req, res) => {
  res.type("text/plain; charset=UTF-8").send("1147329");
});

app.post("/decypher", (req, res) => {
  const busboy = Busboy({ headers: req.headers });
  let keyBuffer = null;
  let secretBuffer = null;

  busboy.on("file", (fieldname, file) => {
    const chunks = [];
    file.on("data", (data) => chunks.push(data));
    file.on("end", () => {
      const buf = Buffer.concat(chunks);
      if (fieldname === "key") keyBuffer = buf;
      if (fieldname === "secret") secretBuffer = buf;
    });
  });

  busboy.on("finish", () => {
    if (!keyBuffer || !secretBuffer) {
      return res.status(400).send("Missing key or secret");
    }

    let decrypted;
    try {
      decrypted = crypto.privateDecrypt(
        {
          key: keyBuffer.toString("utf8"),
          padding: crypto.constants.RSA_PKCS1_PADDING
        },
        secretBuffer
      );
    } catch (e) {
      return res.status(400).send("Decryption failed");
    }

    res.type("text/plain; charset=UTF-8").send(decrypted.toString("utf8"));
  });

  req.pipe(busboy);
});

// Для Render и других хостов прослушиваем порт
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
