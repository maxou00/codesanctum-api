import { OAuth2Client } from "google-auth-library";
import fetch from "node-fetch"

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
    return fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }
    )
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            return data as GoogleUser;
        })
        .catch((err) => {
            console.log(err);
            return undefined;
        });
}