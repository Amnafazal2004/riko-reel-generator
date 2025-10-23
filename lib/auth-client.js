import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000"
})

// Also export individual methods for convenience
export const { signIn, signUp, signOut, useSession, getSession,signIn: { social: signInSocial } } = authClient
//Role: Frontend me signup/login/session easily use karna.
 /** The base URL of the server (optional if you're using the same domain) */

// useUser()
// Purpose: Sirf current logged-in user ka info provide karta hai.
// Returns:
// {
//   user: {
//     id: "user-id",
//     email: "user@example.com"
//   },
//   loading: true/false
// }
// Logged-in check:
// Agar user != null → user logged in hai
// Agar user == null → user logged out hai ya session expire ho gaya
// Note: Session ke details (id, expiresAt) nahi milti, sirf user info.

// useSession()
// Purpose: User + session info dono provide karta hai.
// Returns:
// {
//   session: {
//     id: "session-id",
//     userId: "user-id",
//     expiresAt: "expiry-date"
//   },
//   user: {
//     id: "user-id",
//     email: "user@example.com"
//   },
//   loading: true/false
// }
// Logged-in check:
// Agar session != null → user logged in hai
// Agar session == null → user logged out hai ya session expire ho gaya
