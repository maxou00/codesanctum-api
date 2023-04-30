import { AuthenticationClient } from "auth0";

export const Auth0Config = () => ({
    domain: process.env.AUTH0_DOMAIN || "",
    clientId: process.env.AUTH0_CLIENT_ID || "",
    clientSecret: process.env.AUTH0_CLIENT_SECRET || ""
})


export const authClient = () => {
    let config = Auth0Config();
    return new AuthenticationClient({
        domain: config.domain,
        clientId: config.clientId,
        clientSecret: config.clientSecret
    });
}