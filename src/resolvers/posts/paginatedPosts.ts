import { GraphQLResolver, KeystoneContext } from "@keystone-6/core/types";
import { PrismaClient } from "@prisma/client";

interface Args {
    pageSize: number;
    currentPage: number;
}

const paginatedPosts: GraphQLResolver<KeystoneContext> = async (root, args: Args, context, info) => {
    let { pageSize: perPage = 15, currentPage = 1 } = args;
    const client = context.prisma as PrismaClient;

    let count = await client!.post.count();
    let totalPages = Math.ceil(count / perPage);

    let page = await client!.post.findMany({
        orderBy: [
            { createdAt: "desc" },
            { updatedAt: "desc" }
        ],
        take: perPage,
        skip: perPage * (currentPage - 1)
    });

    const pagination = {
        count,
        pages: totalPages,
        currentPage: currentPage,
        items: page,
    }

    return pagination;
}

export default paginatedPosts;