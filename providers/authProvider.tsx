import { useState, useEffect, ReactNode, useContext } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { IAuthContext, AuthContext } from '@contexts/authContext';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null); // holds data from Firestore
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);

  // Handle auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          // If no doc, create one
          await setDoc(userDocRef, {
            email: currentUser.email,
            createdAt: Timestamp.now(),
          });
          setUserData({ email: currentUser.email });
        } else {
          setUserData(userDocSnap.data());
        }
      } else {
        setUserData(null);
      }

      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string, mobile: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      const userData = {
        email: newUser.email,
        name,
        mobile,
        id: newUser.uid,
        createdAt: Timestamp.now(),
      };

      await setDoc(doc(db, 'users', newUser.uid), userData);
      setUserData(userData);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const loggedInUser = userCredential.user;

      const userDoc = await getDoc(doc(db, 'users', loggedInUser.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserData(null);
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const contextValue: IAuthContext = {
    user,
    userData,
    loadingAuth,
    signUp,
    login,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
