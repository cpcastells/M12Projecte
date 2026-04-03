export type LoginRequest = { email: string; password: string };
export type LoginResponse = { message: string; token: string };

export type RegisterRequest = {
  email: string;
  password: string;
  username: string;
};
export type RegisterResponse = {
  message: string;
  user: { email: string; username: string };
};

export type AuthErrorResponse = { message: string };
