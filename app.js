import express from "express";
import Busboy from "busboy";
import { privateDecrypt } from "crypto";

const app = express();

app.get("/login", (req, res) => res.send("1147329"));

app.post("/decypher", (req, res) => {
  const busboy = Busboy({ headers: req.headers });

  let keyBuffer = Buffer.alloc(0);
  let secretBuffer = Buffer.alloc(0);

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    const chunks = [];
    file.on("data", (data) => chunks.push(data));
    file.on("end", () => {
      const buffer = Buffer.concat(chunks);
      if (fieldname === "key") keyBuffer = buffer;
      else if (fieldname === "secret") secretBuffer = buffer;
    });
  });

  busboy.on("finish", () => {
    try {
      const decrypted = privateDecrypt(
        {
          key: keyBuffer.toString("utf-8"),
          padding: crypto.constants.RSA_PKCS1_PADDING,
        },
        secretBuffer
      );

      res.set("Content-Type", "text/plain; charset=UTF-8");
      res.send(decrypted.toString("utf-8"));
    } catch (err) {
      res.status(400).send("Decryption failed: " + err.message);
    }
  });

  req.pipe(busboy);
});

// Render expects app to listen on this port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
