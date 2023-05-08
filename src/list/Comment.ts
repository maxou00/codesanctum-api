import { list } from "@keystone-6/core";
import { timestamp, json, relationship } from "@keystone-6/core/fields";

const Comment = list({
    access: (ctx) => {
        if(["create", "update", "delete"].includes(ctx.operation)) {
            return Boolean(ctx.session?.id);
        }
        return true
    },
    ui: {
        label: "Commentaire"
    },
    fields: {

        content: json({
            label: "Contenu",
            defaultValue: {}
        }),
        
        author: relationship({
            label: "Auteur du commentaire",
            ref: "User.comments",
            many: false
        }),

        post: relationship({
            label: "Article commenté",
            ref: "Post.comments",
            many: false
        }),

        parent: relationship({
            label: "Commentaire commenté",
            ref: "Comment.comments",
            many: false
        }),

        comments: relationship({
            label: "Commentaires",
            ref: "Comment.parent",
            many: true
        }),

        reactions: relationship({
            label: "Reactions",
            ref: "Reaction.comment",
            many: true
        }),

        createdAt: timestamp({
            defaultValue: {
                kind: 'now'
            },
        }),

        updatedAt: timestamp({
            
        }),
    },
    db: {
        idField: {
            kind: "uuid"
        }
    },

    hooks: {

        resolveInput(args) {
            if(args.operation === "create") {
                let output = {
                    ...args.inputData,
                    author: {
                        connect: {
                            id: args.context.session.id
                        }
                    }
                }
                return output;
            }

            if(args.operation === "update") {
                let output = {
                    ...args.inputData,
                    author: {
                        connect: {
                            id: args.context.session.id
                        }
                    }
                }
                return output;
            }

            return (args as any).resolvedData;
        }
    }
});

export default Comment;