import { createContext, useContext, useEffect, useState } from "react";
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
} from "firebase/auth";
import app from "../../firebase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const auth = getAuth(app);

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Track user login state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [auth]);

    // Sign up
    const signUp = async (email, password) => {
        setLoading(true);
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            setUser(res.user);
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
            return res.user;
        } finally {
            setLoading(false);
        }
    };

    // Google Sign-in
    const loginWithGoogle = async () => {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            const res = await signInWithPopup(auth, provider);
            setUser(res.user);
            return res.user;
        } finally {
            setLoading(false);
        }
    };

    // Logout
    const logout = async () => {
        setLoading(true);
        try {
            await signOut(auth);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // forget password
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
        resetPassword
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
