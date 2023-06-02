const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const routerPlaces = require('./routes/places-routes');
const routerUsers = require('./routes/users-routes');
// const HttpError = require('./models/http-error');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

app.use(bodyParser.json());

app.use('/uploads/images', express.static(__dirname + '/uploads/images'));
app.use(express.static(path.join('public')));

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//   );
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

//   next();
// });

app.use('/api/places', routerPlaces); // /api/places/...
app.use('/api/users', routerUsers); // /api/users/...

app.use((req, res, next) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// app.use((req, res, next) => {
//   const error = new HttpError('could not find this route.', 404);
//   throw error;
// });

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cj8l1uf.mongodb.net/${process.env.DB_NAME}`,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true } // Add useCreateIndex: true
  )
  .then(() => {
    app.listen(5000); // If the connection was successful, start the backend server
  })
  .catch((err) => {
    console.log(err);
  });
