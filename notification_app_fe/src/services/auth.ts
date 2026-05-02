// src/services/auth.ts

// Sanitize the base URL from .env (remove trailing slashes)
const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://20.207.122.201/evaluation-service").trim().replace(/\/$/, "");

export interface RegisterData {
  email: string;
  name: string;
  mobileNo: string;
  githubUsername: string;
  rollNo: string;
  accessCode: string;
}

export interface RegisterResponse {
  clientID: string;
  clientSecret: string;
}

export interface AuthResponse {
  access_token: string;
}

/**
 * Register a new user with robust path handling
 */
export async function registerUser(registrationData: RegisterData): Promise<RegisterResponse> {
  const url = `${API_BASE_URL}/register`;
  
  try {
    console.log(`🚀 Attempting registration at: ${url}`);
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registrationData),
    });

    if (response.ok) {
      return await response.json();
    }
    
    const errorData = await response.json().catch(() => ({}));
    
    if (response.status === 404) {
      throw new Error(`Endpoint not found (404). Please check your API URL in .env`);
    }

    throw new Error(errorData.message || `Server error ${response.status}: ${response.statusText}`);
  } catch (error: any) {
    console.error("Registration error:", error);
    throw error;
  }
}

/**
 * Authenticate (Login Step)
 */
export async function authenticate(
  clientId: string, 
  clientSecret: string,
  email: string,
  name: string,
  rollNo: string
): Promise<string> {
  const url = `${API_BASE_URL}/auth`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      email,
      name,
      rollNo,
      clientID: clientId, 
      clientSecret 
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Authentication failed. Invalid client credentials.");
  }

  const resultData: AuthResponse = await response.json();
  return resultData.access_token;
}
