const dotenv = require('dotenv');
dotenv.config();

const jwt = require('jsonwebtoken');
const JWT_KEY = process.env.SERVER_KEY;
const JWT_EXPIRATION_SECONDS = process.env.JWT_EXP * 1000;

const signToken = username => {
  const token = jwt.sign({ username: username }, JWT_KEY, {
    algorithm: 'HS256',
    expiresIn: JWT_EXPIRATION_SECONDS
  });
  return token;
};
const checkTocken = (req, res, next) => {
  console.log('verifying token');
  const token = req.cookies.token;
  try {
    jwt.verify(token, JWT_KEY);
    next();
  } catch (error) {
    res.status(401).send({ message: 'Unauthorized', payload: error }).end();
  }
};

module.exports = {
  signToken,
  checkTocken
};

