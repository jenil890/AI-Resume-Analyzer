import { getAuth } from 'firebase-admin/auth';

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the Firebase ID Token using modular Admin SDK
    const decodedToken = await getAuth().verifyIdToken(token);
    
    req.user = {
      id: decodedToken.uid,
      email: decodedToken.email,
    };
    
    next();
  } catch (error) {
    console.error('Firebase token verification failed:', error.message);
    res.status(401).json({ message: error.message });
  }
};

export default authMiddleware;
