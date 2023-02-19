require('dotenv/config');
const express = require('express');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');
const ClientError = require('./client-error');
const pg = require('pg');
const uploadsMiddleware = require('./uploads-middleware');
// const path = require('path');

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
  const newItem = req.body;
  // varidate the "inputs" first.
  if ('category' in newItem === false || 'brand' in newItem === false || 'color' in newItem === false || 'notes' in newItem === false || 'userId' in newItem === false) {
    throw new ClientError(400, 'An invalid/missing information.');
  }

  const url = req.file.location; // The S3 url to access the uploaded file later

  // query the database
  const sql = `
    insert into "items" ("image", "category", "brand", "color", "notes", "isFavorite", "userId")
    values ($1, $2, $3, $4, $5, $6, $7)
    returning *
  `;
  // send the user input in a separate array instead of putting the user input directory into our query
  const params = [url, newItem.category, newItem.brand, newItem.color, newItem.notes, newItem.isFavorite, newItem.userId];

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
    select "image", "notes", "itemId"
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

app.get('/api/items/:itemId', (req, res, next) => {
  const itemId = Number(req.params.itemId);
  if (!Number.isInteger(itemId) || itemId <= 0) {
    throw new ClientError(400, 'itemId mush be a positive integer');
  }
  const sql = `
      select "itemId",
             "image",
             "category",
             "brand",
             "color",
             "notes",
             "isFavorite"
       from  "items"
       where "itemId" = $1
  `;
  const params = [itemId];
  db.query(sql, params)
    .then(result => {
      const item = result.rows[0];
      if (!item) {
        throw new ClientError(404, `cannot find item with itemId ${itemId}`);
      }
      res.json(item);
    })
    .catch(err => next(err));
});

app.patch('/api/items/:itemId', uploadsMiddleware, (req, res, next) => {
  const updatedItem = req.body;
  // console.log('updatedItem:', updatedItem);
  const itemId = Number(req.params.itemId);
  // varidate the "inputs" first.
  if ('category' in updatedItem === false || 'brand' in updatedItem === false || 'color' in updatedItem === false || 'notes' in updatedItem === false || 'userId' in updatedItem === false) {
    throw new ClientError(400, 'An invalid/missing information.');
  } else if (!Number.isInteger(itemId) || itemId <= 0) {
    throw new ClientError(400, 'itemId mush be a positive integer');
  }
  // console.log('req.file:', req.file);
  if (req.file === undefined) { // when the image was not updated
    // query the database
    const sql = `
    update "items"
       set "image" = $1,
           "category" = $2,
           "brand" = $3,
           "color" = $4,
           "notes" = $5
     where "itemId" = $6
    returning *
   `;
    // send the user input in a separate array instead of putting the user input directory into our query
    const params = [updatedItem.image, updatedItem.category, updatedItem.brand, updatedItem.color, updatedItem.notes, itemId];
    db.query(sql, params)
      .then(result => {
        const item = result.rows[0];
        if (!item) {
          throw new ClientError(404, `cannot find item with itemId ${itemId}`);
        } else {
          // the query succeeded
          // respond to the client with the status code 200 and created newItem object
          res.status(201).json(item);
        }
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

  } else { // when image was updated
    const url = req.file.location; // The S3 url to access the uploaded file later
    // query the database
    const sql = `
    update "items"
       set "image" = $1,
           "category" = $2,
           "brand" = $3,
           "color" = $4,
           "notes" = $5
     where "itemId" = $6
    returning *
  `;
    // send the user input in a separate array instead of putting the user input directory into our query
    const params = [url, updatedItem.category, updatedItem.brand, updatedItem.color, updatedItem.notes, itemId];

    db.query(sql, params)
      .then(result => {
        const item = result.rows[0];
        if (!item) {
          throw new ClientError(404, `cannot find item with itemId ${itemId}`);
        } else {
          // the query succeeded
          // respond to the client with the status code 200 and created newItem object
          res.status(201).json(item);
        }
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
  }
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
