import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../Auth/AuthContext";
import { Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateProfile } from "firebase/auth";

export default function Register() {
  const { signUp, loginWithGoogle, loading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photoURL, setPhotoURL] = useState(""); 
  const [error, setError] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);

  // Real-time password validation
  useEffect(() => {
    const regex = /^(?=.*[A-Z])(?=.*[\d!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    setPasswordValid(regex.test(password));
  }, [password]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!passwordValid) {
      setError(
        "Password must be at least 8 characters, include 1 uppercase letter and 1 number or special character"
      );
      return;
    }

    try {
      const user = await signUp(email, password); // returns user object

      if (name || photoURL) {
        await updateProfile(user, {
          displayName: name,
          photoURL: photoURL || null,
        });
      }

      toast.success("Registration successful! Redirecting to login...", {
        position: "top-right",
        autoClose: 2000,
      });

      setTimeout(() => navigate("/auth/login"), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleRegister = async () => {
    setError("");
    try {
      await loginWithGoogle();
      toast.success("Google login successful! Redirecting to home...", {
        position: "top-right",
        autoClose: 2000,
      });
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden text-white">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-black to-blue-900 animate-gradient bg-[length:400%_400%]" />
      <div className="absolute inset-0 bg-black/70" />

      <motion.div
        className="relative w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl p-8 z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h2
          className="text-3xl font-bold text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Create Account
        </motion.h2>

        {error && <p className="text-red-400 text-center mb-2">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`w-full px-4 py-3 rounded-xl bg-gray-800 text-white border ${
                password.length > 0
                  ? passwordValid
                    ? "border-green-500"
                    : "border-red-500"
                  : "border-gray-700"
              } focus:ring-2 focus:ring-blue-500 outline-none`}
              placeholder="Enter your password"
            />
            {password.length > 0 && !passwordValid && (
              <p className="text-red-400 text-sm mt-1">
                Must be 8+ chars, 1 uppercase, 1 number/special char
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Photo URL (optional)</label>
            <input
              type="text"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign Up"}
          </motion.button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-700"></div>
          <span className="mx-4 text-gray-500 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-700"></div>
        </div>

        <motion.button
          onClick={handleGoogleRegister}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-700 bg-gray-800 rounded-xl hover:bg-gray-700 transition"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FcGoogle size={22} /> Continue with Google
        </motion.button>

        <div className="flex justify-between items-center mt-6 text-gray-400 text-sm">
          <Link to="/" className="hover:underline">← Back to Home</Link>
          <p>
            Already have an account?{" "}
            <Link to="/auth/login" className="text-blue-400 hover:underline font-semibold">
              Login
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Toast container */}
      <ToastContainer />
    </div>
  );
}
