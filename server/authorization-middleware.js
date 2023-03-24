const jwt = require('jsonwebtoken'); // eslint-disable-line
const ClientError = require('./client-error'); // eslint-disable-line

function authorizationMiddleware(req, res, next) {
  // get the 'X-Access-Token' from the request headers
  const token = req.get('X-Access-Token');
  if (!token) { // if no token is provided
    throw new ClientError(401, 'authentication required');
  }
  try {
    // verify the authenticity of the token and extract its payload
    const payload = jwt.verify(token, process.env.TOKEN_SECRET);
    // assign the extracted payload to the user property of the req object
    req.user = payload;
    // call next() to let Express know to advance to its next route or middleware
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = authorizationMiddleware;
