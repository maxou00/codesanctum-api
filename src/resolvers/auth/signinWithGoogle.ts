import { GraphQLResolver, KeystoneContext } from "@keystone-6/core/types";
import { PrismaClient } from "@prisma/client";
import { getUserWithAccessToken } from "../../core/google";

interface Args {
    accessToken: string;
}

export const signinWithGoogle: GraphQLResolver<KeystoneContext> = async (root, args: Args, context, info) => {
    try {
        console.log("Args: ", args);
        let profile = await getUserWithAccessToken(args.accessToken);
        console.log("Google Profile: ", profile);
        if (!profile) {
            return null;
        }
        let client = context.prisma as PrismaClient;
        let user = await client.user.findFirst({
            where: {
                providers: {
                    path: ['google', 'sub'],
                    equals: profile.sub
                }
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
                providers: {
                    google: {
                        email: profile.email,
                        sub: profile.sub
                    }
                }
            }
        });

        let token = await context.sessionStrategy?.start({ data: user, context });
        return {
            accessToken: token,
            user
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}