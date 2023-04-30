import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { timestamp, json, relationship, select } from "@keystone-6/core/fields";

const Reaction = list({
    ui: {
        label: "Reaction"
    },
    access: allowAll,
    fields: {
        type: select({
            options: [{
                label: "Like",
                value: "LIKE"
            },
            {
                label: "Love",
                value: "LOVE"
            },
            {
                label: "Inspire",
                value: "INSPIRE"
            }]
        }),
        post: relationship({
            label: "Article",
            ref: "Post.reactions"
        }),

        comment: relationship({
            label: "Commentaire",
            ref: "Comment.reactions"
        }),

        author: relationship({
            label: "Utilisateur",
            ref: "User.reactions"
        }),

        createdAt: timestamp({
            defaultValue: {
                kind: 'now'
            },
        }),
    },
    db: {
        idField: {
            kind: "uuid"
        }
    }
});

export default Reaction;