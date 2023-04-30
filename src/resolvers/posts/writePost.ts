import { GraphQLResolver, KeystoneContext } from "@keystone-6/core/types"
import { PrismaClient } from "@prisma/client";
import { v4 } from "uuid";

interface CreateOrUpdatePost {
    id: string
    slug: string;
    metadata: any
    content: any
    cover: any
    published: boolean
    tags: string[]
}


const writePost: GraphQLResolver<KeystoneContext> = async (root, args: { data: CreateOrUpdatePost }, context, info) => {
    if (!context.session.id) {
        return null;
    }

    let body = args.data;
    const client = context.prisma as PrismaClient;
    /// validate and then
    let valid = true;
    if (valid) {

        if (body.id) {
            let source = await client!.post.findUnique({
                where: {
                    id: body.id,
                },
            });

            if (source) {

                let copy: any = { ...source };

                let previousTags = await client.tag.findMany({ where: { posts: { id: { equals: body.id } } } });

                let connected: any[] = [];
                let disconnected: any[] = [];

                previousTags.forEach((previous) => {
                    let found = body.tags.findIndex((tag) => tag === previous.id);
                    if (found < 0) {
                        disconnected.push({ id: previous.id });
                    }
                });

                body.tags.forEach((tag) => {
                    let exists = previousTags.findIndex((t) => t.id === tag);
                    if (exists > 0) {
                        connected.push({ id: tag });
                    }
                })

                copy.content = body.content;
                copy.cover = body.cover;
                copy.published = body.published;
                copy.metadata = body.metadata;
                copy.updatedAt = new Date();

                delete copy.id;

                let update = await client!.post.update({
                    where: {
                        id: source.id,
                    },
                    data: {
                        ...copy,
                        tags: {
                            connect: connected,
                            disconnect: disconnected
                        }
                    }
                });

                return update;
            }
        }
        let post = await client!.post.create({
            data: {
                id: v4(),
                metadata: body.metadata,
                cover: body.cover,
                content: body.content,
                published: body.published,
                author: {
                    connectOrCreate: {
                        where: {
                            authId: process.env.USER_AUTHID || ""
                        },
                        create: {
                            id: v4(),
                            authId: process.env.USER_AUTHID || "",
                            firstname: "Maximilien",
                            lastname: "COMLAN",
                            email: "maximiliencomlan05@gmail.com",
                        }
                    }
                },
                tags: {
                    connect: body.tags.map((it) => {
                        return { id: it }
                    })
                },
                createdAt: new Date(Date.now())
            }
        });

        return post;

    }
    return null;
}

export default writePost;