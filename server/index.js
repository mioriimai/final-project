require('dotenv/config');
const express = require('express');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');
const ClientError = require('./client-error');
const pg = require('pg');
const uploadsMiddleware = require('./uploads-middleware');

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

/* -------------------------------
      Clients can GET all items.
----------------------------------- */
app.get('/api/items', (req, res, next) => {
  // query the database
  const sql = `
    select "image", "notes", "itemId", "favorite"
    from "items"
    order by "itemId"
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

/* -------------------------------------------
   Clients can GET a item's info by itemId.
--------------------------------------------- */
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
             "favorite"
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

/* ------------------------------------------------------
   Clients can GET item's info that have favorite = true.
--------------------------------------------------------- */
app.get('/api/favoriteItems', (req, res, next) => {
  const sql = `
    select "image", "notes", "itemId", "favorite"
    from "items"
    where "favorite" = $1
    order by "itemId"
  `;
  const favorite = true;
  const params = [favorite];
  db.query(sql, params)
    .then(result => {
      const items = result.rows;
      // the query succeeded
      // respond to the client with the status code 200 and all rows from the "items" table
      res.status(200).json(items);
    })
    .catch(err => next(err));
});

/* -----------------------------------------------------------------------
   Clients can GET items that meet specific category and brand and color.
------------------------------------------------------------------------- */
app.get('/api/items/:category/:brand/:color', (req, res, next) => {
  const category = req.params.category;
  const brand = req.params.brand;
  const color = req.params.color;

  if (typeof category !== 'string' || typeof brand !== 'string' || typeof color !== 'string') {
    throw new ClientError(400, 'mush be strings');
  }

  let whereCondition;
  let paramsArray;
  if (category === 'Category' && brand === 'Brand') { // select items have specific category and brand
    whereCondition = '"color" = $1';
    paramsArray = [color];

  } else if (category === 'Category' && color === 'Color') { // select items have specific category and color
    whereCondition = '"brand" = $1';
    paramsArray = [brand];

  } else if (category === 'Category') { // select items have specific category
    whereCondition = '"brand" = $1 AND "color" = $2';
    paramsArray = [brand, color];

  } else if (brand === 'Brand' && color === 'Color') { // select items have specific brand and color
    whereCondition = '"category" = $1';
    paramsArray = [category];

  } else if (brand === 'Brand') { // select items have specific brand
    whereCondition = '"category" = $1 AND "color" = $2';
    paramsArray = [category, color];

  } else if (color === 'Color') { // select items have specific color
    whereCondition = '"category" = $1 AND "brand" = $2';
    paramsArray = [category, brand];

  } else { // select items have specific category and brand and color
    whereCondition = '"category" = $1 AND "brand" = $2 AND "color" = $3';
    paramsArray = [category, brand, color];
  }

  const sql = `
      select "itemId",
             "image",
             "notes",
             "favorite"
       from  "items"
       where ${whereCondition}
       order by "itemId"
  `;
  const params = paramsArray;
  db.query(sql, params)
    .then(result => {
      const items = result.rows;
      res.json(items);
    })
    .catch(err => next(err));
});

/* -------------------------------------------------
      Clients can GET all outfits with all info.
--------------------------------------------------- */
app.get('/api/outfitItems', (req, res, next) => {
  const sql = `
        select "outfitItems"."outfitId",
               "outfitItems"."itemId",
               "outfitItems"."deltaX",
               "outfitItems"."deltaY",
               "outfits"."userId",
               "outfits"."notes" as "outfitNotes",
               "outfits"."favorite",
               "items"."image"
        from "outfitItems"
        join "outfits" using ("outfitId")
        join "items" using ("itemId")
        order by "outfitId"
        `;
  db.query(sql)
    .then(result => {
      res.status(200).json(result.rows);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'An unexpected error occurred.'
      });
    });
});

/* -------------------------------------------------
      Clients can GET all rows in outfits table.
--------------------------------------------------- */
app.get('/api/outfits', (req, res, next) => {
  const sql = `
    select "outfitId", "notes", "userId", "favorite"
    from "outfits"
    order by "outfitId"
  `;
  db.query(sql)
    .then(result => {
      res.status(200).json(result.rows);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'An unexpected error occurred.'
      });
    });
});
/* -------------------------------------------------------------
  Clients can GET a specifit outfit with its info by outfitId.
--------------------------------------------------------------- */
app.get('/api/outfits/:outfitId', (req, res, next) => {
  const outfitId = Number(req.params.outfitId);
  if (!Number.isInteger(outfitId) || outfitId <= 0) {
    throw new ClientError(400, 'outfitId mush be a positive integer');
  }

  const sql = `
       select "outfitId",
              "userId",
              "notes"
        from "outfits"
        where "outfitId" = $1
       `;

  const params = [outfitId];
  db.query(sql, params)
    .then(result => {
      const item = result.rows[0];
      if (!item) {
        throw new ClientError(404, `cannot find outfit with outfitId ${outfitId}`);
      }
      res.json(item);
    })
    .catch(err => next(err));

});
/* -------------------------------------------------------------------------
  Clients can GET all items for a specifit outfit with its info by outfitId.
--------------------------------------------------------------------------- */
app.get('/api/outfitItems/:outfitId', (req, res, next) => {
  const outfitId = Number(req.params.outfitId);
  if (!Number.isInteger(outfitId) || outfitId <= 0) {
    throw new ClientError(400, 'outfifId mush be a positive integer');
  }

  const sql = `
      select "outfitItems"."outfitId",
             "outfitItems"."itemId",
             "outfitItems"."deltaX",
             "outfitItems"."deltaY",
             "outfits"."userId",
             "items"."image"
        from  "outfitItems"
        join "outfits" using ("outfitId")
        join "items" using ("itemId")
       where "outfitId" = $1
  `;
  const params = [outfitId];
  db.query(sql, params)
    .then(result => {
      res.status(200).json(result.rows);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'An unexpected error occurred.'
      });
    });
});

/* -------------------------------------------
   Clients can POST a new item with its info.
--------------------------------------------- */
app.post('/api/form-item', uploadsMiddleware, (req, res, next) => {
  const newItem = req.body;
  // varidate the "inputs" first.
  if ('category' in newItem === false || 'brand' in newItem === false || 'color' in newItem === false || 'notes' in newItem === false || 'userId' in newItem === false) {
    throw new ClientError(400, 'An invalid/missing information.');
  }

  // The S3 url to access the uploaded file later
  const url = req.file.location;

  // query the database
  const sql = `
    insert into "items" ("image", "category", "brand", "color", "notes", "favorite", "userId")
    values ($1, $2, $3, $4, $5, $6, $7)
    returning *
  `;
  // send the user input in a separate array instead of putting the user input directory into our query
  const params = [url, newItem.category, newItem.brand, newItem.color, newItem.notes, newItem.favorite, newItem.userId];

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

/* -------------------------------------------
   Clients can POST a outfit with its info.
--------------------------------------------- */
app.post('/api/form-outfit', uploadsMiddleware, (req, res, next) => {
  const newOutfit = req.body;
  // varidate the "inputs" first.
  if ('userId' in newOutfit === false || 'notes' in newOutfit === false || 'favorite' in newOutfit === false) {
    throw new ClientError(400, 'An invalid/missing information.');
  }
  // query the database
  const sql = `
    insert into "outfits" ("notes", "favorite", "userId")
    values ($1, $2, $3)
    returning *
  `;

  const params = [newOutfit.notes, newOutfit.favorite, newOutfit.userId];

  db.query(sql, params)
    .then(result => {
      // the query succeeded
      res.status(201).json(result.rows[0]);
    })
    .catch(err => {
      // the query failed for some reason
      console.error(err);
      // respond to the client with a generic 500 error message
      res.status(500).json({
        error: 'An unexpected error occurred.'
      });
    });
});

/* ---------------------------------------------------------------------------
    Clients can POST items that are used for outfit to the outfitItems table.
----------------------------------------------------------------------------- */
app.post('/api/store-item-for-outfit', uploadsMiddleware, (req, res, next) => {
  const item = req.body;
  // varidate the "inputs" first.
  if ('userId' in item === false || 'outfitId' in item === false || 'itemId' in item === false || 'deltaX' in item === false || 'deltaY' in item === false) {
    throw new ClientError(400, 'An invalid/missing information.');
  }
  // query the database
  const sql = `
    insert into "outfitItems" ("outfitId", "itemId", "userId", "deltaX", "deltaY")
    values ($1, $2, $3, $4, $5)
    returning *
  `;
  const params = [item.outfitId, item.itemId, item.userId, item.deltaX, item.deltaY];

  db.query(sql, params)
    .then(result => {
      // the query succeeded
      res.status(201).json(result.rows[0]);
    })
    .catch(err => {
      // the query failed for some reason
      console.error(err);
      // respond to the client with a generic 500 error message
      res.status(500).json({
        error: 'An unexpected error occurred.'
      });
    });
});

/* -------------------------------------------------------
   Clients can PATECH item's info(favorite) by its itemId.
--------------------------------------------------------- */
app.patch('/api/itemFavoriteUpdate/:itemId', (req, res, next) => {
  const favoriteState = req.body;
  const itemId = Number(req.params.itemId);
  if (!Number.isInteger(itemId) || itemId <= 0) {
    throw new ClientError(400, 'itemId mush be a positive integer');
  } else if ('favorite' in favoriteState === false) {
    throw new ClientError(400, 'An invalid/missing information.');
  }
  const sql = `
       update "items"
       set   "favorite" = $1
       where "itemId" = $2
       returning *
  `;
  const params = [favoriteState.favorite, itemId];
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
      console.error(err);
      // respond to the client with a generic 500 error message
      res.status(500).json({
        error: 'An unexpected error occurred.'
      });
    });
});

/* -----------------------------------------------------
   Clients can PATECH edited item's info by its itemId.
------------------------------------------------------ */
app.patch('/api/items/:itemId', uploadsMiddleware, (req, res, next) => {
  const updatedItem = req.body;

  const itemId = Number(req.params.itemId);
  // varidate the "inputs" first.
  if ('category' in updatedItem === false || 'brand' in updatedItem === false || 'color' in updatedItem === false || 'notes' in updatedItem === false || 'userId' in updatedItem === false) {
    throw new ClientError(400, 'An invalid/missing information.');
  } else if (!Number.isInteger(itemId) || itemId <= 0) {
    throw new ClientError(400, 'itemId mush be a positive integer');
  }

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

/* -----------------------------------------
   Clients can DELETE an item by its itemId.
-------------------------------------------- */

app.delete('/api/items/:itemId', (req, res, next) => {
  const itemId = Number(req.params.itemId);
  if (!Number.isInteger(itemId) || itemId <= 0) {
    throw new ClientError(400, 'itemId mush be a positive integer');
  }

  const sql = `
       delete
       from  "items"
       where "itemId" = $1
       returning *
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

/* -----------------------------------------------------------------------------------
   Clients can DELETE items in outfitItems table that match with a specific outfitId.
------------------------------------------------------------------------------------ */
app.delete('/api/outfitItems/:outfitId', (req, res, next) => {
  const outfitId = Number(req.params.outfitId);
  if (!Number.isInteger(outfitId) || outfitId <= 0) {
    throw new ClientError(400, 'outfitId mush be a positive integer');
  }
  const sql = `
       delete
       from  "outfitItems"
       where "outfitId" = $1
       returning *
  `;
  const params = [outfitId];
  db.query(sql, params)
    .then(result => {
      const item = result.rows[0];
      if (!item) {
        throw new ClientError(404, `cannot find item with outfitId ${outfitId}`);
      }
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
