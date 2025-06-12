import x from "express";
import BusBoy from "busboy";
import zlib from "zlib";

const app = x();

app.get("/login", (req, res) => res.send("1147329"));

app.post("/zipper", (req, res) => {
  const busboy = BusBoy({ headers: req.headers });

  let fileBuffer = Buffer.alloc(0);

  busboy.on("file", (fieldname, file, info) => {
    file.on("data", (data) => {
      fileBuffer = Buffer.concat([fileBuffer, data]);
    });
  });

  busboy.on("finish", () => {
    res.attachment(`result.gz`);

    const gzip = zlib.createGzip();
    gzip.on("error", (err) => res.status(500).send({ error: err.message }));

    gzip.pipe(res);
    gzip.end(fileBuffer);
  });

  req.pipe(busboy);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
