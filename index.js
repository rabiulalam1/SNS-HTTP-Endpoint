const express = require('express');
const app = express();
const cors = require('cors');

//logger
const { format } = require('date-fns');
const { v4: uuid } = require('uuid');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const bodyParser = require('body-parser');
app.use(cors());
app.use((req, res, next) => {
  if (req.get('x-amz-sns-meesage-type'))
    req.headers['content-type'] = 'application/json';
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const PORT = 5000;

const logEvents = async (message, logFileName) => {
  const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss');
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
      await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
    }
    await fsPromises.appendFile(
      path.join(__dirname, '..', 'logs', logFileName),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};

const logger = (req, res, next) => {
  logEvents(
    `${req.method}\t${req.url}\t${req.headers.origin}\t${req.body}`,
    'reqLog.log'
  );
  console.log(`${req.method} ${req.path} ${req}`);
  next();
};

app.use(logger);

app.get('/', (req, res) => {
  res.json({ message: 'Get-OK' });
});

app.post('/', (req, res) => {
  res.json({ message: 'Post-OK' }).status(200);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
