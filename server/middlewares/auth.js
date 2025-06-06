const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Token is required' });
  }

  jwt.verify(token, 'user203u', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = { 
      id: decoded.id, 
      type: decoded.type, 
      nom: decoded.nom, 
      prenom: decoded.prenom 
    };
    next();
  });
};
const adminOnly = (req, res, next) => {
  if (req.user && req.user.type === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied: Admin only' });
  }
};


module.exports = { verifyToken , adminOnly };
