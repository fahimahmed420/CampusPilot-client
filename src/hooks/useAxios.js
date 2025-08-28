import { useMemo } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api"; // change for prod

export const useAxios = () => {
  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Optional: Add interceptors
    instance.interceptors.response.use(
      (res) => res,
      (err) => {
        console.error("Axios Error:", err.response?.data || err.message);
        return Promise.reject(err);
      }
    );

    return instance;
  }, []);

  return axiosInstance;
};
