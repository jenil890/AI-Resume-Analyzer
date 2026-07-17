import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../services/firebase';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Subscribe to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Retrieve ID token and save to localStorage for Axios interceptor
          const token = await firebaseUser.getIdToken();
          localStorage.setItem('token', token);

          // Retrieve user profile details from MongoDB database
          const response = await api.get('/auth/profile');
          setUser(response.data);
        } catch (error) {
          console.error('Failed to sync profile from MongoDB:', error.message);
          // If the profile is not yet synchronized, it will be handled by the sign-up flow
        }
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const token = await credential.user.getIdToken();
      localStorage.setItem('token', token);

      // Fetch local profile synced in DB
      const response = await api.get('/auth/profile');
      setUser(response.data);
      
      return { success: true };
    } catch (error) {
      console.error('Firebase Login failed:', error);
      if (error.response?.data?.message) {
        return { success: false, error: error.response.data.message };
      }
      let friendlyMessage = 'Login failed';
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        friendlyMessage = 'Invalid email or password';
      }
      return { success: false, error: friendlyMessage };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(auth, provider);
      const token = await credential.user.getIdToken();
      localStorage.setItem('token', token);

      try {
        const response = await api.get('/auth/profile');
        setUser(response.data);
      } catch (profileError) {
        if (profileError.response?.status === 404) {
          // Sync profile to local MongoDB if first time Google sign-in
          const syncResponse = await api.post('/auth/register', { 
            name: credential.user.displayName || 'Google User' 
          });
          setUser(syncResponse.data.user);
        } else {
          throw profileError;
        }
      }
      return { success: true };
    } catch (error) {
      console.error('Firebase Google Login failed:', error);
      const friendlyMessage = error.response?.data?.message || error.message || 'Google Sign-In failed';
      return { success: false, error: friendlyMessage };
    }
  };

  const register = async (name, email, password) => {
    try {
      // 1. Create account on Firebase
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await credential.user.getIdToken();
      localStorage.setItem('token', token);

      // 2. Synchronize user profile info to MongoDB (includes auth headers via Axios interceptor)
      const syncResponse = await api.post('/auth/register', { name });
      setUser(syncResponse.data.user);

      return { success: true };
    } catch (error) {
      console.error('Firebase Registration failed:', error);
      if (error.response?.data?.message) {
        return { success: false, error: error.response.data.message };
      }
      let friendlyMessage = 'Registration failed';
      if (error.code === 'auth/email-already-in-use') {
        friendlyMessage = 'An account already exists with this email';
      } else if (error.code === 'auth/weak-password') {
        friendlyMessage = 'Password is too weak. Please use at least 6 characters.';
      }
      return { success: false, error: friendlyMessage };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('token');
      setUser(null);
    } catch (error) {
      console.error('Firebase Logout failed:', error.message);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      // Updates only name locally on database (email change managed through Firebase Console)
      const response = await api.put('/auth/profile', { name: profileData.name });
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      console.error('Update profile failed:', error.message);
      return { success: false, error: error.response?.data?.message || 'Failed to update profile' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithGoogle,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
