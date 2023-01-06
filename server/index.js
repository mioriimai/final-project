require('dotenv/config');
const express = require('express');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');
const ClientError = require('./client-error');
const pg = require('pg');
const uploadsMiddleware = require('./uploads-middleware');
const path = require('path');

// create a database connection object to use the pg package.
const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();

app.use(staticMiddleware);
app.use(express.json());

app.post('/api/form-item', uploadsMiddleware, (req, res, next) => {
  // varidate the "inputs" first.
  const newItem = req.body;
  if ('isFavorite' in newItem === false || 'userId' in newItem === false) {
    throw new ClientError(400, 'An invalid/missing information.');
  }

  // create a url for the image by combining '/images' with req.file.filename
  const url = path.join('/images', req.file.filename);

  // query the database
  const sql = `
    insert into "items" ("originalImage", "bgRemovedImage", "category", "brand", "color", "notes", "isFavorite", "userId")
    values ($1, $2, $3, $4, $5, $6, $7, $8)
    returning *
  `;
  // send the user input in a separate array instead of putting the user input directory into our query
  const params = [url, newItem.bgRemovedImage, newItem.category, newItem.brand, newItem.color, newItem.notes, newItem.isFavorite, newItem.userId];

  db.query(sql, params)
    .then(result => {
      // the query succeeded
      // respond to the client with the status code 200 and created newItem object
      res.status(201).json(result.rows[0]);
    })
    .catch(err => {
      // the query failed for some reason
      // possibly due to a syntax error in the SQL statement
      // print the error to STDERR (the terminal) for debugging purposes
      console.error(err);
      // respond to the client with a generic 500 error message
      res.status(500).json({
        error: 'An unexpected error occurred.'
      });
    });
});

app.get('/api/items', (req, res, next) => {
  // query the database
  const sql = `
    select "originalImage", "notes"
    from "items"
  `;

  db.query(sql)
    .then(result => {
      // the query succeeded
      // respond to the client with the status code 200 and all rows from the "items" table
      res.status(200).json(result.rows);
    })
    .catch(err => {
      // the query failed for some reason
      // possibly due to a syntax error in the SQL statement
      // print the error to STDERR (the terminal) for debugging purposes
      console.error(err);
      // respond to the client with a generic 500 error message
      res.status(500).json({
        error: 'An unexpected error occurred.'
      });
    });
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
