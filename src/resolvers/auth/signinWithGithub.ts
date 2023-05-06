import { GraphQLResolver, KeystoneContext } from "@keystone-6/core/types";
import { PrismaClient } from "@prisma/client";
import { exchangeGithubCodeWithAccessToken, getUserWithAccessToken } from "../../core/github";

interface Args {
    code: string;
}

export const signinWithGithub: GraphQLResolver<KeystoneContext> = async (root, args: Args, context, info) => {
    console.log("Args: ", args);
    let access_token = await exchangeGithubCodeWithAccessToken(args.code);
    let profile = await getUserWithAccessToken(access_token);
    console.log("Github Profile: ", profile);
    if (!profile) {
        return null;
    }
    let client = context.prisma as PrismaClient;
    let user = await client.user.findFirst({
        where: {
            providers: {
                path: ['github', 'id'],
                equals: profile.id
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
            providers: {
                github: {
                    id: profile.id,
                    url: profile.url,
                    avatar_url: profile.avatar_url
                },
            },
            picture: {
                url: profile.avatar_url || "",
            },
        }
    });

    let token = await context.sessionStrategy?.start({ data: user, context });
    return {
        accessToken: token,
        user
    }
}