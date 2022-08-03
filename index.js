const express = require('express');
const app = express();

app.use((req, res, next) => {
  if (req.get('x-amz-sns-message-type'))
    req.headers['content-type'] = 'application/json';
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = 5000;

app.get('/', (req, res) => {
  res.json({ message: 'Get-OK' }).status(200);
});

app.post('/', (req, res) => {
  console.log(req.body);
  res.json({ message: 'Post-OK' }).status(200);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
