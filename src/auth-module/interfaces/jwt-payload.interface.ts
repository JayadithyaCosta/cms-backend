export interface JwtPayload {
  sub: string; // The subject (user id)
  name: string; // Additional fields you might want to include
  role: string;
  // Add other fields as necessary, e.g., roles, email, etc.
}
