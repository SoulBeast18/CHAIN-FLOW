import { createContext, useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  auth,
  db 
} from '../config/firebase';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, collection, getDocs, query, where, setDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext(null);

// Role permissions configuration
const rolePermissions = {
  admin: ['read', 'write', 'delete', 'manage_users', 'manage_roles'],
  manager: ['read', 'write', 'manage_inventory', 'manage_suppliers']
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  // Fetch all users from Firestore
  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);
      return usersList;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          const userData = userDoc.data();
          
          if (!userData) {
            console.error('No user data found in Firestore');
            setUser(null);
          } else if (userData.role !== 'admin' && userData.role !== 'manager') {
            console.error('Invalid user role');
            setUser(null);
          } else {
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email,
              username: userData.username || firebaseUser.email,
              role: userData.role,
              createdAt: userData.createdAt
            });

            if (userData.role === 'admin') {
              await fetchUsers();
            }
          }
        } else {
          setUser(null);
          setUsers([]);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get user data from Firestore
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();

      if (!userData) {
        await signOut(auth); // Sign out if no Firestore data
        throw new Error('User data not found');
      }

      if (userData.role !== 'admin' && userData.role !== 'manager') {
        await signOut(auth); // Sign out if invalid role
        throw new Error('Invalid user role');
      }

      // Log user login activity
      await setDoc(doc(db, 'userLogs', `${userCredential.user.uid}_${Date.now()}`), {
        userId: userCredential.user.uid,
        email: userCredential.user.email,
        action: 'login',
        timestamp: serverTimestamp(),
        role: userData.role
      });

      setUser({
        id: userCredential.user.uid,
        email: userCredential.user.email,
        username: userData.username || userCredential.user.email,
        role: userData.role,
        createdAt: userData.createdAt
      });

      // Fetch all users if the logged-in user is an admin
      if (userData.role === 'admin') {
        await fetchUsers();
      }

      return userData.role;
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle specific Firebase Auth errors
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        throw new Error('Invalid email or password');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many login attempts. Please try again later.');
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error('Network error. Please check your connection.');
      } else if (error.message === 'User data not found') {
        throw new Error('Account setup incomplete. Please contact support.');
      } else if (error.message === 'Invalid user role') {
        throw new Error('Access denied. Invalid user role.');
      }
      
      throw new Error('An unexpected error occurred. Please try again.');
    }
  };

  const logout = async () => {
    try {
      if (user) {
        // Log user logout activity
        await setDoc(doc(db, 'userLogs', `${user.id}_${Date.now()}`), {
          userId: user.id,
          email: user.email,
          action: 'logout',
          timestamp: serverTimestamp(),
          role: user.role
        });
      }
      await signOut(auth);
      setUser(null);
      setUsers([]);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    const permissions = rolePermissions[user.role] || [];
    return permissions.includes(permission);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      users, // Making users list available in context
      login, 
      logout, 
      hasPermission,
      fetchUsers // Making fetchUsers function available in context
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const RequireAuth = ({ children, permissions = [] }) => {
  const { user, hasPermission } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Check if user is admin and trying to access admin routes
  if (user.role === 'admin' && window.location.pathname.startsWith('/admin')) {
    return children;
  }

  // Check if user is manager and trying to access manager routes
  if (user.role === 'manager' && window.location.pathname.startsWith('/manager')) {
    return children;
  }

  // Redirect based on role
  if (user.role === 'admin') {
    return <Navigate to="/admin" />;
  } else if (user.role === 'manager') {
    return <Navigate to="/manager" />;
  }

  return <Navigate to="/" />;
};