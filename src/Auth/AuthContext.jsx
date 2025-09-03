import { createContext, useContext, useEffect, useState } from "react";
import {
  getAuth,
  onIdTokenChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import app from "../../firebase";
import { useAxios } from "../hooks/useAxios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const auth = getAuth(app);
  const axiosInstance = useAxios();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Save new user to DB
  const saveUserToDB = async (user) => {
    try {
      const token = await user.getIdToken();
      await axiosInstance.post(
        "/users",
        {
          uid: user.uid,
          name: user.displayName || "",
          email: user.email,
          photoURL: user.photoURL || "",
          createdAt: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  // Track login + refresh token safely
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          // Get token (do NOT force refresh to avoid loops)
          const token = await currentUser.getIdToken();
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${token}`;
          console.log("Auth state:", currentUser.email);
          console.log("Token set:", axiosInstance.defaults.headers.common["Authorization"]);
        } else {
          delete axiosInstance.defaults.headers.common["Authorization"];
          console.log("Auth state: No user");
        }
        setUser(currentUser);
      } catch (err) {
        console.error("Token error:", err);
      } finally {
        // Always stop loading, even if error occurs
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, axiosInstance]);

  // Signup
  const signUp = async (email, password) => {
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      setUser(res.user);
      await saveUserToDB(res.user);
      return res.user;
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      setUser(res.user);
      const token = await res.user.getIdToken();
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
      return res.user;
    } finally {
      setLoading(false);
    }
  };

  // Google login
  const loginWithGoogle = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const res = await signInWithPopup(auth, provider);
      setUser(res.user);
      await saveUserToDB(res.user);
      const token = await res.user.getIdToken();
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
      return res.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      delete axiosInstance.defaults.headers.common["Authorization"];
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    return await sendPasswordResetEmail(auth, email);
  };

  const value = {
    user,
    loading,
    signUp,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    axiosInstance,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-3xl font-bold">
        Loading...
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
