// middleware/protect.route.middleware.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    console.log('Token not found');
    return res.status(401).json({
      message: 'No Token'
    });
  } 
  const splittedToken = token.split(' ')[1]

  try {
    const result = jwt.verify(splittedToken, process.env.JWT_SECRET)
    
    if (!result.userId) {
      console.log('Token verification failed');
      res.status(401).json({
        message: "No Authorized"
      })
      return
    } else {
      console.log('Token verified successfully');
      next();
    }
  } catch (error) {
    res.status(401).json({
      message: "No Authorized"
    })
  }
};

module.exports = authenticateToken;
