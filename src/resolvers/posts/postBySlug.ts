import { GraphQLResolver, KeystoneContext } from "@keystone-6/core/types";
import { PrismaClient } from "@prisma/client";

interface Args {
    slug: string;
}

const postBySlug: GraphQLResolver<KeystoneContext> = async (root, args: Args, context, info) => {
    let {slug} = args;
    const client = context.prisma as PrismaClient;

    let source = await client!.post.findFirst({
        where: {
            metadata: {
                path: ['slug'],
                equals: slug
            }
        },
    });

    return source;
}

export default postBySlug;