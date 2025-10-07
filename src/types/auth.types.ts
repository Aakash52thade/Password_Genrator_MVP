/**
 * JWT Payload structure
 */
export interface JWTPayload {
    userId: string;
    email: string;
    iat?: number; // Issued at
    exp?: number; // Expiration time
  }
  
  /**
   * User response (sent to client)
   */
  export interface UserResponse {
    _id: string;
    email: string;
    createdAt: Date;
    updatedAt?: Date;
  }
  
  /**
   * Auth response after login/register
   */
  export interface AuthResponse {
    success: boolean;
    message: string;
    user?: UserResponse;
    token?: string;
  }
  
  /**
   * Auth state for frontend
   */
  export interface AuthState {
    user: UserResponse | null;
    isAuthenticated: boolean;
    isLoading: boolean;
  }