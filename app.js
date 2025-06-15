import express from 'express';
import Busboy from 'busboy';
import crypto from 'crypto';

const app = express();

app.get('/login', (req, res) => {
  res.type('text/plain; charset=UTF-8').send('1147329');
});

app.post('/decypher', (req, res) => {
  const busboy = Busboy({ headers: req.headers });

  let privateKeyBuffer = null;
  let secretBuffer = null;

  busboy.on('file', (fieldname, file) => {
    const chunks = [];

    file.on('data', chunk => chunks.push(chunk));
    file.on('end', () => {
      const buffer = Buffer.concat(chunks);
      if (fieldname === 'key') privateKeyBuffer = buffer;
      if (fieldname === 'secret') secretBuffer = buffer;
    });
  });

  busboy.on('finish', () => {
    if (!privateKeyBuffer || !secretBuffer) {
      return res.status(400).send('Missing key or secret');
    }

    try {
      const decrypted = crypto.privateDecrypt(
        {
          key: privateKeyBuffer.toString(),
          padding: crypto.constants.RSA_PKCS1_PADDING,
        },
        secretBuffer
      );

      res.type('text/plain; charset=UTF-8').send(decrypted.toString('utf8').trim());
    } catch (err) {
      res.status(400).send('Decryption failed: ' + err.message);
    }
  });

  req.pipe(busboy);
});

// Render compatibility
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
