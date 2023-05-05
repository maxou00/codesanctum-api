import { GraphQLResolver, KeystoneContext } from "@keystone-6/core/types";
import { authClient } from "../../core/auth0";
import { User as Auth0User } from "auth0";
import { PrismaClient } from "@prisma/client";
import { OAuth2Client } from "google-auth-library";
import { getGoogleClient } from "../../core/google";

interface Args {
    authCode: string;
}


async function exchangeCodeForTokens(code: string) {
    const { tokens } = await getGoogleClient().getToken(code);
    const accessToken = tokens.access_token;
    const idToken = tokens.id_token;
    return { accessToken, idToken };
}

export const signinWithGoogle: GraphQLResolver<KeystoneContext> = async (root, args: Args, context, info) => {
    let googleClient = getGoogleClient();
    let tokens = await exchangeCodeForTokens(args.authCode);
    if(!tokens.idToken) {
        return null;
    }
    let verification = await googleClient.verifyIdToken({
        idToken: tokens.idToken
    });
    let profile = verification.getPayload();
    if (!profile) {
        return null;
    }
    let client = context.prisma as PrismaClient;
    let user = await client.user.findFirst({
        where: {
            AND: [
                {
                    providers: {
                        path: ['type'],
                        equals: "google"
                    }
                },
                {
                    providers: {
                        path: ['sub'],
                        equals: profile.sub || ""
                    }
                }
            ]
        }
    });

    if (user) {

        let token = await context.sessionStrategy?.start({ data: user, context });
        return {
            accessToken: token,
            user
        }
    }

    let name = profile.name;
    let [firstName, lastName] = (name || "").split(" ");

    user = await client.user.create({
        data: {
            firstname: profile.given_name || firstName,
            lastname: profile.family_name || lastName,
            email: profile.email || "",
            picture: {
                url: profile.picture || "",
            },
        }
    });

    let token = await context.sessionStrategy?.start({ data: user, context });
    return {
        accessToken: token,
        user
    }
}