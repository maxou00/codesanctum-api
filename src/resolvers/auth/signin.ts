import { GraphQLResolver, KeystoneContext } from "@keystone-6/core/types";
import { authClient } from "../../core/auth0";
import { User as Auth0User } from "auth0";
import { PrismaClient } from "@prisma/client";

interface Args {
    auth0Token: string;
}

export const signin: GraphQLResolver<KeystoneContext> = async (root, args: Args, context, info) => {
    let profile: Auth0User & { sub: string } = await authClient().getProfile(args.auth0Token).catch((err) => {
        console.log(err);
        return undefined;
    });
    if (!profile) {
        return null;
    }
    let client = context.prisma as PrismaClient;
    let user = await client.user.findFirst({
        where: {
            authId: profile.sub
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
            auth0Avatar: profile.picture || "",
            authId: profile.sub
        }
    });

    let token = await context.sessionStrategy?.start({ data: user, context });
    return {
        accessToken: token,
        user
    }
}