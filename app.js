const express = require('express');
const multer = require('multer');
const zlib = require('zlib');

const app = express();
const upload = multer();

app.get('/login', (req, res) => {
  res.type('text/plain; charset=UTF-8').send('1147329');
});

app.post('/zipper', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  zlib.gzip(req.file.buffer, (err, compressedData) => {
    if (err) {
      return res.status(500).send('Compression failed');
    }

    res.set({
      'Content-Type': 'application/gzip',
      'Content-Disposition': 'attachment; filename="result.gz"'
    });
    res.send(compressedData);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
