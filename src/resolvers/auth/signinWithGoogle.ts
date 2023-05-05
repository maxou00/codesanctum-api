import { GraphQLResolver, KeystoneContext } from "@keystone-6/core/types";
import { authClient } from "../../core/auth0";
import { User as Auth0User } from "auth0";
import { PrismaClient } from "@prisma/client";
import peoples from "@googleapis/people";
import { google } from "../../core/google";

interface Args {
    accessToken: string;
}

export const signinWithGoogle: GraphQLResolver<KeystoneContext> = async (root, args: Args, context, info) => {
    let googleApi = new peoples.auth.OAuth2({ clientId: google.clientId, clientSecret: google.clientSecret });
    let people = await peoples.people("v1").people.get({
        resourceName: "people/me",
        access_token: args.accessToken
    })
    .catch((err) => {
        console.log(err);
        return null;
    })

    console.log("People ", people);

    let profile = await googleApi.getTokenInfo(
        args.accessToken
    )
        .catch((err) => { console.log(err); return null });

    if (!profile) {
        return null;
    }

    console.log("Profile ", profile);

    return null;

    /*let client = context.prisma as PrismaClient;
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

    let name = profile.email;
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
    */
}