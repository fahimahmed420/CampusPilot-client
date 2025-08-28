import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../Auth/AuthContext";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router";

const Login = () => {
  const { login, loginWithGoogle, resetPassword, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/"; 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Please enter your email first.");
      return;
    }
    try {
      await resetPassword(email);
      setMessage("Password reset link sent to your email.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden text-white">
      {/* Animated Gradient Background */}
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
          Welcome Back
        </motion.h2>

        {error && <p className="text-red-400 text-center mb-2">{error}</p>}
        {message && <p className="text-green-400 text-center mb-2">{message}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your password"
            />
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <button type="button" onClick={handleResetPassword} className="hover:underline text-blue-400">
              Forgot password?
            </button>
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Login"}
          </motion.button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-700"></div>
          <span className="mx-4 text-gray-500 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-700"></div>
        </div>

        <motion.button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-700 bg-gray-800 rounded-xl hover:bg-gray-700 transition"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FcGoogle size={22} /> Continue with Google
        </motion.button>

        <div className="flex justify-between items-center mt-6 text-gray-400 text-sm">
          <Link to="/" className="hover:underline">← Back to Home</Link>
          <p>
            Don't have an account?{" "}
            <Link to="/auth/sign-up" className="text-blue-400 hover:underline font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
