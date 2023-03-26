require('dotenv/config');
const express = require('express');
const argon2 = require('argon2'); // eslint-disable-line
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');
const ClientError = require('./client-error');
const pg = require('pg');
const uploadsMiddleware = require('./uploads-middleware');
const jwt = require('jsonwebtoken');

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

/* --------------------------------------------------------
     Clients can POST user info for registration(sign-up).
--------------------------------------------------------- */
app.post('/api/auth/sign-up', (req, res, next) => {
  const { name, username, password } = req.body;
  if (!name || !username || !password) {
    throw new ClientError(400, 'name, username and password are required fields');
  }

  argon2
    .hash(password)
    .then(hassedPassword => {
      const sql = `
    insert into "users" ("name", "username", "hashedPassword")
    values ($1, $2, $3)
    returning *
    `;
      const params = [name, username, hassedPassword];
      db.query(sql, params)
        .then(result => {
          const newUser = result.rows[0];
          res.status(201).json(newUser);
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({
            error: 'Please try with other username.'
          });
        });
    })
    .catch(err => next(err));
});

/* --------------------------------------------------------
   Clients can POST user info for authorization(sign-in).
--------------------------------------------------------- */
app.post('/api/auth/sign-in', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(401, 'invalid login');
  }
  const sql = `
    select "userId",
           "hashedPassword"
      from "users"
     where "username" = $1
  `;
  const params = [username];
  db.query(sql, params)
    .then(result => {
      const [user] = result.rows;
      if (!user) {
        throw new ClientError(401, 'invalid login');
      }
      const { userId, hashedPassword } = user;
      return argon2
        .verify(hashedPassword, password)
        .then(isMatching => {
          if (!isMatching) {
            throw new ClientError(401, 'invalid login');
          }
          const payload = { userId, username };
          const token = jwt.sign(payload, process.env.TOKEN_SECRET);
          res.json({ token, user: payload });
        });
    })
    .catch(err => next(err));
});

/* -------------------------------
     Clients can GET usernames.
--------------------------------- */
app.get('/api/usernames', (req, res, next) => {
  const sql = `
       select "username"
       from "users"
       `;
  db.query(sql)
    .then(result => {
      res.status(201).json(result.rows);
    })
    // .catch(err => next(err));
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'An unexpected error occurred.'
      });
    });
});

/* ------------------------------------------
    Clients can GET all items with userId.
-------------------------------------------- */
app.get('/api/items/:userId', (req, res, next) => {
  const userId = Number(req.params.userId);
  // query the database
  const sql = `
    select "image", "notes", "itemId", "favorite"
    from "items"
    where "userId" = $1
    order by "itemId"
  `;
  const params = [userId];
  db.query(sql, params)
    .then(result => {
      const items = result.rows;
      res.status(200).json(items);
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
app.get('/api/items/:itemId/:userId', (req, res, next) => {
  const itemId = Number(req.params.itemId);
  const userId = Number(req.params.userId);
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
       where "itemId" = $1 AND "userId" = $2
  `;
  const params = [itemId, userId];
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
app.get('/api/favoriteItems/:userId', (req, res, next) => {
  const userId = Number(req.params.userId);
  const sql = `
    select "image", "notes", "itemId", "favorite"
    from "items"
    where "favorite" = $1 AND "userId" = $2
    order by "itemId"
  `;
  const favorite = true;
  const params = [favorite, userId];
  db.query(sql, params)
    .then(result => {
      const items = result.rows;
      res.status(200).json(items);
    })
    .catch(err => next(err));
});

/* ------------------------------------------------------
    Clients can GET all outfit that have favorite = true.
--------------------------------------------------------- */
app.get('/api/favoriteOutfits/:userId', (req, res, next) => {
  const userId = Number(req.params.userId);
  const sql = `
    select "notes", "outfitId", "favorite", "userId"
    from "outfits"
    where "favorite" = $1 AND "userId" = $2
    order by "outfitId"
  `;
  const favorite = true;
  const params = [favorite, userId];
  db.query(sql, params)
    .then(result => {
      const outfits = result.rows;
      res.status(200).json(outfits);
    })
    .catch(err => next(err));
});

/* -----------------------------------------------------------------------
   Clients can GET items that meet specific category and brand and color.
------------------------------------------------------------------------- */
app.get('/api/items/:category/:brand/:color/:userId', (req, res, next) => {
  const category = req.params.category;
  const brand = req.params.brand;
  const color = req.params.color;
  const userId = Number(req.params.userId);

  if (typeof category !== 'string' || typeof brand !== 'string' || typeof color !== 'string') {
    throw new ClientError(400, 'must be strings');
  }

  let whereCondition;
  let paramsArray;
  if (category === 'Category' && brand === 'Brand') { // select items have specific category and brand
    whereCondition = '"color" = $1 AND "userId" = $2';
    paramsArray = [color, userId];

  } else if (category === 'Category' && color === 'Color') { // select items have specific category and color
    whereCondition = '"brand" = $1 AND "userId" = $2';
    paramsArray = [brand, userId];

  } else if (category === 'Category') { // select items have specific category
    whereCondition = '"brand" = $1 AND "color" = $2 AND "userId" = $3';
    paramsArray = [brand, color, userId];

  } else if (brand === 'Brand' && color === 'Color') { // select items have specific brand and color
    whereCondition = '"category" = $1 AND "userId" = $2';
    paramsArray = [category, userId];

  } else if (brand === 'Brand') { // select items have specific brand
    whereCondition = '"category" = $1 AND "color" = $2 AND "userId" = $3';
    paramsArray = [category, color, userId];

  } else if (color === 'Color') { // select items have specific color
    whereCondition = '"category" = $1 AND "brand" = $2 AND "userId" = $3';
    paramsArray = [category, brand, userId];

  } else { // select items have specific category and brand and color
    whereCondition = '"category" = $1 AND "brand" = $2 AND "color" = $3 AND "userId" = $4';
    paramsArray = [category, brand, color, userId];
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

/* -------------------------------------------------------------
      Clients can GET all items used for outfits with all info.
------------------------------------------------------------- */
app.get('/api/outfitItems/:userId', (req, res, next) => {
  const userId = Number(req.params.userId);
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
        where "outfits"."userId" = $1
        order by "outfitId"
        `;
  const params = [userId];
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

/* -------------------------------------------------
      Clients can GET all rows in outfits table.
--------------------------------------------------- */
app.get('/api/outfits/:userId', (req, res, next) => {
  const userId = Number(req.params.userId);
  const sql = `
    select "outfitId", "notes", "userId", "favorite"
    from "outfits"
    where "userId" = $1
    order by "outfitId"
  `;
  const params = [userId];
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
/* -------------------------------------------------------------
  Clients can GET a specifit outfit with its info by outfitId.
--------------------------------------------------------------- */
app.get('/api/outfits/:outfitId/:userId', (req, res, next) => {
  const outfitId = Number(req.params.outfitId);
  const userId = Number(req.params.userId);
  if (!Number.isInteger(outfitId) || outfitId <= 0) {
    throw new ClientError(400, 'outfitId mush be a positive integer');
  }
  const sql = `
       select "outfitId",
              "userId",
              "notes"
        from "outfits"
        where "outfitId" = $1 AND "userId" = $2
       `;

  const params = [outfitId, userId];
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
app.get('/api/outfitItems/:outfitId/:userId', (req, res, next) => {
  const outfitId = Number(req.params.outfitId);
  const userId = Number(req.params.userId);
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
       where "outfitId" = $1 AND "outfits"."userId" = $2
  `;
  const params = [outfitId, userId];
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

  const sql = `
    insert into "items" ("image", "category", "brand", "color", "notes", "favorite", "userId")
    values ($1, $2, $3, $4, $5, $6, $7)
    returning *
  `;
  const params = [url, newItem.category, newItem.brand, newItem.color, newItem.notes, newItem.favorite, newItem.userId];
  db.query(sql, params)
    .then(result => {
      res.status(201).json(result.rows[0]);
    })
    .catch(err => {
      console.error(err);
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
  if ('userId' in newOutfit === false || 'notes' in newOutfit === false || 'favorite' in newOutfit === false) {
    throw new ClientError(400, 'An invalid/missing information.');
  }
  const sql = `
    insert into "outfits" ("notes", "favorite", "userId")
    values ($1, $2, $3)
    returning *
  `;
  const params = [newOutfit.notes, newOutfit.favorite, newOutfit.userId];
  db.query(sql, params)
    .then(result => {
      res.status(201).json(result.rows[0]);
    })
    .catch(err => {
      console.error(err);
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
  if ('userId' in item === false || 'outfitId' in item === false || 'itemId' in item === false || 'deltaX' in item === false || 'deltaY' in item === false) {
    throw new ClientError(400, 'An invalid/missing information.');
  }
  const sql = `
    insert into "outfitItems" ("outfitId", "itemId", "userId", "deltaX", "deltaY")
    values ($1, $2, $3, $4, $5)
    returning *
  `;
  const params = [item.outfitId, item.itemId, item.userId, item.deltaX, item.deltaY];

  db.query(sql, params)
    .then(result => {
      res.status(201).json(result.rows[0]);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'An unexpected error occurred.'
      });
    });
});

/* -------------------------------------------------------
   Clients can PATECH item's info(favorite) by its itemId.
--------------------------------------------------------- */
app.patch('/api/itemFavoriteUpdate/:itemId/:userId', (req, res, next) => {
  const updateData = req.body;
  const itemId = Number(req.params.itemId);
  const userId = Number(req.params.userId);
  if (!Number.isInteger(itemId) || itemId <= 0) {
    throw new ClientError(400, 'itemId mush be a positive integer');
  } else if ('favorite' in updateData === false) {
    throw new ClientError(400, 'An invalid/missing information.');
  }
  const sql = `
       update "items"
       set   "favorite" = $1
       where "itemId" = $2 AND "userId" = $3
       returning *
  `;
  const params = [updateData.favorite, itemId, userId];
  db.query(sql, params)
    .then(result => {
      const item = result.rows[0];
      if (!item) {
        throw new ClientError(404, `cannot find item with itemId ${itemId}`);
      } else {
        res.status(201).json(item);
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'An unexpected error occurred.'
      });
    });
});

/* -----------------------------------------------------------
   Clients can PATECH outfit's info(favorite) by its outfitId.
------------------------------------------------------------- */
app.patch('/api/outfitFavoriteUpdate/:outfitId/:userId', (req, res, next) => {
  const updateData = req.body;
  const outfitId = Number(req.params.outfitId);
  const userId = Number(req.params.userId);
  if (!Number.isInteger(outfitId) || outfitId <= 0) {
    throw new ClientError(400, 'outfitId mush be a positive integer');
  } else if ('favorite' in updateData === false) {
    throw new ClientError(400, 'An invalid/missing information.');
  }
  const sql = `
       update "outfits"
       set   "favorite" = $1
       where "outfitId" = $2 AND "userId" = $3
       returning *
  `;
  const params = [updateData.favorite, outfitId, userId];
  db.query(sql, params)
    .then(result => {
      const outfit = result.rows[0];
      if (!outfit) {
        throw new ClientError(404, `cannot find outfit with outfitId ${outfitId}`);
      } else {
        res.status(201).json(outfit);
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'An unexpected error occurred.'
      });
    });
});

/* -----------------------------------------------------
   Clients can PATECH edited item's info by its itemId.
------------------------------------------------------ */
app.patch('/api/items/:itemId/:userId', uploadsMiddleware, (req, res, next) => {
  const updatedItem = req.body;
  const itemId = Number(req.params.itemId);
  const userId = Number(req.params.userId);
  if ('category' in updatedItem === false || 'brand' in updatedItem === false || 'color' in updatedItem === false || 'notes' in updatedItem === false || 'userId' in updatedItem === false) {
    throw new ClientError(400, 'An invalid/missing information.');
  } else if (!Number.isInteger(itemId) || itemId <= 0) {
    throw new ClientError(400, 'itemId mush be a positive integer');
  }

  if (req.file === undefined) { // when the image was not updated
    const sql = `
    update "items"
       set "image" = $1,
           "category" = $2,
           "brand" = $3,
           "color" = $4,
           "notes" = $5
     where "itemId" = $6 AND "userId" = $7
    returning *
   `;
    const params = [updatedItem.image, updatedItem.category, updatedItem.brand, updatedItem.color, updatedItem.notes, itemId, userId];
    db.query(sql, params)
      .then(result => {
        const item = result.rows[0];
        if (!item) {
          throw new ClientError(404, `cannot find item with itemId ${itemId}`);
        } else {
          res.status(201).json(item);
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({
          error: 'An unexpected error occurred.'
        });
      });

  } else { // when image was updated
    const url = req.file.location; // The S3 url to access the uploaded file later
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
    const params = [url, updatedItem.category, updatedItem.brand, updatedItem.color, updatedItem.notes, itemId];

    db.query(sql, params)
      .then(result => {
        const item = result.rows[0];
        if (!item) {
          throw new ClientError(404, `cannot find item with itemId ${itemId}`);
        } else {
          res.status(201).json(item);
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({
          error: 'An unexpected error occurred.'
        });
      });
  }
});

/* ---------------------------------------------------------
   Clients can PATECH outfit's info(notes) by its outfitId.
----------------------------------------------------------- */
app.patch('/api/outfitsNotes/:outfitId/:userId', (req, res, next) => {
  const newNotes = req.body;
  const outfitId = Number(req.params.outfitId);
  const userId = Number(req.params.userId);
  if (!Number.isInteger(outfitId) || outfitId <= 0) {
    throw new ClientError(400, 'outfitId mush be a positive integer');
  } else if ('notes' in newNotes === false) {
    throw new ClientError(400, 'An invalid/missing information.');
  }
  const sql = `
       update "outfits"
       set   "notes" = $1
       where "outfitId" = $2 AND "userId" = $3
       returning *
  `;
  const params = [newNotes.notes, outfitId, userId];
  db.query(sql, params)
    .then(result => {
      const outfit = result.rows[0];
      if (!outfit) {
        throw new ClientError(404, `cannot find outfit with outfitId ${outfitId}`);
      } else {
        res.status(201).json(outfit);
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'An unexpected error occurred.'
      });
    });
});

/* -----------------------------------------
   Clients can DELETE an item by its itemId.
-------------------------------------------- */
app.delete('/api/items/:itemId/:userId', (req, res, next) => {
  const itemId = Number(req.params.itemId);
  const userId = Number(req.params.userId);
  if (!Number.isInteger(itemId) || itemId <= 0) {
    throw new ClientError(400, 'itemId mush be a positive integer');
  }

  const sql = `
       delete
       from  "items"
       where "itemId" = $1 AND "userId" = $2
       returning *
  `;
  const params = [itemId, userId];
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

/* ---------------------------------------------
   Clients can DELETE an outfit by its outfitId.
----------------------------------------------- */
app.delete('/api/outfits/:outfitId/:userId', (req, res, next) => {
  const outfitId = Number(req.params.outfitId);
  const userId = Number(req.params.userId);
  if (!Number.isInteger(outfitId) || outfitId <= 0) {
    throw new ClientError(400, 'outfitId mush be a positive integer');
  }
  const sql = `
       delete
       from  "outfits"
       where "outfitId" = $1 AND "userId" = $2
       returning *
  `;
  const params = [outfitId, userId];
  db.query(sql, params)
    .then(result => {
      const outfit = result.rows[0];
      if (!outfit) {
        throw new ClientError(404, `cannot find outfit with outfitId ${outfitId}`);
      }
      res.json(outfit);
    })
    .catch(err => next(err));
});

/* -----------------------------------------------------------------------------------
   Clients can DELETE items in outfitItems table that match with a specific outfitId.
------------------------------------------------------------------------------------ */
app.delete('/api/outfitItems/:outfitId/:userId', (req, res, next) => {
  const outfitId = Number(req.params.outfitId);
  const userId = Number(req.params.userId);
  if (!Number.isInteger(outfitId) || outfitId <= 0) {
    throw new ClientError(400, 'outfitId mush be a positive integer');
  }
  const sql = `
       delete
       from  "outfitItems"
       where "outfitId" = $1 AND "userId" = $2
       returning *
  `;
  const params = [outfitId, userId];
  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
