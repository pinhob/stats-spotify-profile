require('dotenv').config();
const express = require('express');

const app = express();
const PORT = 8888;

app.get('/', (_req, res) => res.send(`Hello World!`));

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}/`));
