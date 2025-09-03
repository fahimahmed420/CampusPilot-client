import { useMemo } from "react";
import axios from "axios";

const BASE_URL = "https://campuspilot-server.vercel.app/api";

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
