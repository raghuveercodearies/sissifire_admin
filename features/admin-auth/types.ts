export interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
}

export interface AdminAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  admin: Admin;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminSignupRequest {
  name: string;
  email: string;
  password: string;
  signup_secret: string;
}