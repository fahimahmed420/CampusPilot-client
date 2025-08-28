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
import { useAxios } from "../hooks/useAxios";


const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const auth = getAuth(app);
    const axiosInstance = useAxios(); // custom axios instance

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // save new user to DB
    const saveUserToDB = async (user) => {
        try {
            // Get Firebase ID token
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

    // Track user login state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // optionally refresh token or attach token for axios
                const token = await currentUser.getIdToken();
                axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            } else {
                delete axiosInstance.defaults.headers.common["Authorization"];
            }

            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [auth, axiosInstance]);

    // Sign up
    const signUp = async (email, password) => {
        setLoading(true);
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            setUser(res.user);

            // Save to DB
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

            // Update token in axios
            const token = await res.user.getIdToken();
            axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

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

            // Save to DB
            await saveUserToDB(res.user);

            // Update token in axios
            const token = await res.user.getIdToken();
            axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

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

            // Remove token
            delete axiosInstance.defaults.headers.common["Authorization"];
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
        resetPassword,
        axiosInstance, // optionally expose for other API calls
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
