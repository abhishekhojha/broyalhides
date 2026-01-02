// Authentication Types
export interface OTPRequest {
  identifier: string; // Email or phone
  purpose?: "login" | "signup" | "reset";
}

export interface OTPVerifyRequest {
  identifier: string;
  otp: string;
  purpose?: string;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface CompleteProfileRequest {
  name: string;
  password: string;
}

export interface AuthResponse {
  status?: string;
  message: string;
  accessToken: string;
}

export interface UserProfile {
  _id: string;
  email?: string;
  phone?: string;
  name?: string;
  avatar?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  role: Role | string;
  isActive: boolean;
  isProfileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  _id: string;
  name: string;
  permissions: string[];
}

// Helper type for JWT payload
export interface JWTPayload {
  userId: string;
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  isProfileCompleted: boolean;
  role?: string;
  isActive: boolean;
}
