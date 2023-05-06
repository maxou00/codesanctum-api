import fetch from "node-fetch"

interface GitHubUser {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
    name: string;
    company: string;
    blog: string;
    location: null;
    email: string;
    hireable: boolean;
    bio: string;
    twitter_username: string;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    created_at: Date;
    updated_at: Date;
  }

export const github = {
    clientId: process.env.GITHUB_CLIENT_ID || "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    redirectUri: "https://test.codesanctum.org/signin?oauth=github"
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
            return data as GitHubUser;
        })
        .catch((err: any) => {
            console.log(err);
            return undefined;
        });
}