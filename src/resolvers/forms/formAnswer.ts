import { GraphQLResolver, KeystoneContext } from "@keystone-6/core/types";
import { PrismaClient } from "@prisma/client";

interface Args {
    formId: string;
}

export const getFormAnswer: GraphQLResolver<KeystoneContext> = async (root, args: Args, context, info) => {
    if (!context.session.id) {
        return null;
    }

    let client = context.prisma as PrismaClient;
    let answer = await client.answer.findFirst({
        where: {
            AND: [{ formId: args.formId || root.id }, { userId: context.session.id }],
        }
    });

    return answer;
}