import { OAuth2Client } from "google-auth-library";
import axios from "axios";

export interface GoogleUser {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
    locale: string;
}

export const google = {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    redirectUri: "https://api-test.codesanctum.org/auth/google/callback"
};

export function getGoogleClient() {
    return new OAuth2Client(google.clientId, google.clientSecret, google.redirectUri);
}

export async function getUserWithAccessToken(accessToken: string) {
    return axios.get("https://www.googleapis.com/oauth2/v3/userinfo", { headers: { 'Authorization': `Bearer ${accessToken}` } })
        .then((res) => {
            if (res.status !== 200) {
                return undefined;
            }
            return res.data as GoogleUser;
        })
        .catch((err) => {
            return undefined;
        });
}