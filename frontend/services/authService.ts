import axiosInstance from "../lib/axiosInstance";

export interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar: string;
    isAdmin: boolean;
    permissions: string[];
  };
  token: string;
}

/**
 * Calls POST /api/login with email & password.
 * Returns the user object and JWT token on success.
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await axiosInstance.post("/login", { email, password });
  return response.data.data as LoginResponse;
};
