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

export const github = {
    clientId: process.env.GITHUB_CLIENT_ID || "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    redirectUri: "https://test.codesanctum.org/signin/github"
};

export async function exchangeGithubCodeWithAccessToken(code: string) {
    return fetch(
        `https://github.com/login/oauth/access_token?client_id=${github.clientId}&client_secret=${github.clientSecret}&code=${code}`,
        {
            method: "POST",
            headers: {
                'Accept': 'application/json'
            }
        }
    )
        .then((res: any) => res.json())
        .then((data: any) => {
            let access_token = data.access_token
            return access_token;
        })
        .catch((err: any) => {
            console.log(err);
            return undefined;
        });
}

export async function getUserWithAccessToken(accessToken: string) {
    return fetch(
        "https://api.github.com/user",
        {
            method: "GET",
            headers: {
                'Authorization': `token ${accessToken}`,
                "X-GitHub-Api-Version": "2022-11-28",
                "Accept": "application/vnd.github+json"
            }
        }
    )
        .then((res: any) => res.json())
        .then((data: any) => {
            console.log(data);
            return data as any;
        })
        .catch((err: any) => {
            console.log(err);
            return undefined;
        });
}