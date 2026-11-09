/** Body of `POST /api/auth/login` (`LoginCommand`). */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Body of `POST /api/auth/register` (`RegisterCommand`). New accounts are always `Customer`. */
export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}
