import { GraphQLResolver, KeystoneContext } from "@keystone-6/core/types";
import { PrismaClient } from "@prisma/client";
import { getRedisClient } from "../../core/utils";

interface Args {
    email: string;
    otp: string;
}

export const signinWithOTP: GraphQLResolver<KeystoneContext> = async (root, args: Args, context, info) => {
    let otpMatch = await getRedisClient().getex(`otp-${args.otp}`);
    if (otpMatch) {
        let client = context.prisma as PrismaClient;
        let user = await client.user.findFirst({
            where: {
                id: otpMatch
            }
        });

        if (user) {
            
            let token = await context.sessionStrategy?.start({ data: user, context });
            return {
                accessToken: token,
                user
            }
        }

    }

    return null;
}