import { GraphQLResolver, KeystoneContext } from "@keystone-6/core/types";
import { authClient } from "../../core/auth0";
import { User as Auth0User } from "auth0";
import { PrismaClient } from "@prisma/client";
import { OAuth2Client } from "google-auth-library";

interface Args {
    accessToken: string;
}

export const signinWithGoogle: GraphQLResolver<KeystoneContext> = async (root, args: Args, context, info) => {
    let googleApi = new OAuth2Client({ clientId: process.env.GOOGLE_CLIENT_ID || "", clientSecret: process.env.GOOGLE_CLIENT_SECRET || "" });
    let verification = await googleApi.verifyIdToken({
        idToken: args.accessToken
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