const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Success! Server is running on port: ${PORT}`)
);

mongoose.connect(
  process.env.DATABASE_CONNECTION_STRING,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  (err) => {
    if (err) throw err;
    console.log('Connected to MongoDB database');
  }
);
app.use('/user', require('./routes/user'));
app.use('/posts', require('./routes/post'));
app.use('/search', require('./routes/search'));
