import { db } from '../server.js';

export const register = async (req, res) => {
  try {
    const { name } = req.body;
    const { id: uid, email } = req.user; // Verified and parsed by authMiddleware from Firebase Admin

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    let userData;
    if (!userDoc.exists) {
      // Sync Firebase User to Firestore
      userData = {
        name,
        email,
        createdAt: new Date()
      };
      await userRef.set(userData);
    } else {
      userData = userDoc.data();
      if (userData.name !== name) {
        userData.name = name;
        await userRef.update({ name });
      }
    }

    res.status(201).json({
      user: {
        id: uid,
        name: userData.name,
        email: userData.email || email,
      },
    });
  } catch (error) {
    console.error('User sync error:', error);
    res.status(500).json({ message: 'Server error during user synchronization' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userRef = db.collection('users').doc(req.user.id);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User profile not synchronized in local database' });
    }
    
    res.json({
      _id: userDoc.id,
      ...userDoc.data()
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error during profile retrieval' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userRef = db.collection('users').doc(req.user.id);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name } = req.body;
    if (name) {
      await userRef.update({ name });
    }

    const updatedDoc = await userRef.get();
    const userData = updatedDoc.data();

    res.json({
      user: {
        id: updatedDoc.id,
        name: userData.name,
        email: userData.email,
      },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error during profile update' });
  }
};
