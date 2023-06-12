const jwt = require('jsonwebtoken');

// Middleware function to verify JWT (JSON Web Token)
const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization;
  
  if (!authorization) {
    return res.status(401).send({ error: true, message: 'unauthorized access' });
  }

  // Extracting the token from the "Authorization" header
  // The format of the header is assumed to be "Bearer <token>"
  const token = authorization.split(' ')[1];

  // Verifying the token using the secret key
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: true, message: 'unauthorized access' });
    }

    // If the token is successfully verified, store the decoded payload in the request object
    req.decoded = decoded;
    next();
  });
};

module.exports = verifyJWT;
