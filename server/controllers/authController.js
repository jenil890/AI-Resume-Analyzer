import User from '../models/User.js';

export const register = async (req, res) => {
  try {
    const { name } = req.body;
    const { id: uid, email } = req.user; // Verified and parsed by authMiddleware from Firebase Admin

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    let user = await User.findById(uid);
    if (!user) {
      // Sync Firebase User to MongoDB
      user = await User.create({
        _id: uid,
        name,
        email,
      });
    } else {
      // If user exists, sync name if changed
      user.name = name;
      await user.save();
    }

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('User sync error:', error);
    res.status(500).json({ message: 'Server error during user synchronization' });
  }
};

export const getProfile = async (req, res) => {
  try {
    // req.user.id is the Firebase UID decoded from the ID token
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User profile not synchronized in local database' });
    }
    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error during profile retrieval' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name } = req.body;
    if (name) user.name = name;

    await user.save();

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error during profile update' });
  }
};
