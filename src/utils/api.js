import axios from "axios";
import { getSession } from "next-auth/react";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
});

// Attach session token and user role/email to every request automatically
api.interceptors.request.use(async (config) => {
  try {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers["Authorization"] = `Bearer ${session.accessToken}`;
    }
    if (session?.user?.email) {
      config.headers["x-user-email"] = session.user.email;
    }
    if (session?.user?.role) {
      config.headers["x-user-role"] = session.user.role;
    }
  } catch {
    // No session, continue without auth headers
  }
  return config;
});

export default api;
