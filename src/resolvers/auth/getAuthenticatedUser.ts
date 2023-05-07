import { Lists } from ".keystone/types";
import { GraphQLResolver, KeystoneContext } from "@keystone-6/core/types";

export const getAuthenticatedUser: GraphQLResolver<KeystoneContext> = async (root, args: any, context, info) => {
    if (!context.session?.id) {
        return null
    }
    return context.session;
}