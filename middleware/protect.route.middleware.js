// middleware/protect.route.middleware.js
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];

  console.log('Request Headers:', req.headers);

  if (!token) {
    console.log('Token not found');
    return res.sendStatus(401);
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      console.log('Token verification failed');
      return res.sendStatus(403);
    }
    req.user = user;
    console.log('Token verified successfully');
    next();
  });
};

module.exports = authenticateToken;
