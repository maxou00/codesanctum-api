import { OAuth2Client } from "google-auth-library";

export const google = {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    redirectUri: "https://api-test.codesanctum.org/auth/google/callback"
};

export function getGoogleClient() {
    return new OAuth2Client({ clientId: google.clientId, clientSecret: google.clientSecret, redirectUri: google.redirectUri });
}