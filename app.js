import express from 'express';

const app = express();

app.get('/api/login', (req, res) => {
  res.type('text/plain; charset=UTF-8').send('1147329');
});

app.get('/api/mpy/:x1/:x2', (req, res) => {
  const { x1, x2 } = req.params;
  const n1 = Number(x1);
  const n2 = Number(x2);

  if (isNaN(n1) || isNaN(n2)) {
    return res.status(400).send('Invalid input');
  }

  res.type('text/plain; charset=UTF-8').send((n1 * n2).toString());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`HTTP server running on port ${PORT}`);
});
