const argon2 = require('argon2');

const password = process.argv[2];

argon2
  .hash(password)
  .then(hashedPassword => {
    // eslint-disable-next-line no-console
    console.log(hashedPassword);
  })
  .catch(err => {
    console.error(err);
  });
