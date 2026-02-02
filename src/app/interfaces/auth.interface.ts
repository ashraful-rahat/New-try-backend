export interface RegisterDTO {
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

// Roles
export type AdminRole = 'admin' | 'member';

// Response after login/register
export interface AuthResponse {
  message: string;
  admin?: {
    id: string;
    email: string;
    role: AdminRole;
  };
  token?: string;
}

// JWT Payload
export interface JwtPayload {
  id: string;
  email: string;
  role: AdminRole;
}
