import Lottie from "lottie-react";
import error from "../assets/error-edit.json";
import { useNavigate } from "react-router";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-6">
      {/* Lottie Animation */}
      <div className="w-80 md:w-96">
        <Lottie animationData={error} loop={true} />
      </div>

      {/* Text */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-6">
        Oops! Page Not Found
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mt-2 text-center max-w-md">
        The page you are looking for doesn’t exist or has been moved.
      </p>

      {/* Home Button */}
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-blue-600 cursor-pointer text-white rounded-lg shadow hover:bg-blue-700 transition mt-6"
      >
        Go Home
      </button>
    </div>
  );
}
