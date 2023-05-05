import { GraphQLResolver, KeystoneContext } from "@keystone-6/core/types";
import { PrismaClient } from "@prisma/client";
import { getUserWithAccessToken } from "../../core/google";

interface Args {
    authCode: string;
}

export const signinWithGoogle: GraphQLResolver<KeystoneContext> = async (root, args: Args, context, info) => {
    let profile = await getUserWithAccessToken(args.authCode);
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