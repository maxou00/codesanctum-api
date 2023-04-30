import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { text, timestamp, select, json, relationship, checkbox } from "@keystone-6/core/fields";

const Post = list({
    access: allowAll,
    ui: {
        label: "Article"
    },
    fields: {
        metadata: json({
            label: "Metadata",
            defaultValue: {}
        }),

        cover: json({
            label: "Cover",
            defaultValue: {}
        }),

        content: json({
            label: "Contenu",
            defaultValue: {}
        }),

        published: checkbox({
            label: "Publié",
            defaultValue: true,
        }),

        tags: relationship({
            label: "Tags associés",
            ref: "Tag.posts",
            many: true
        }),

        author: relationship({
            label: "Auteur de la publication",
            ref: "User.posts",
            many: false
        }),

        comments: relationship({
            label: "Commentaires",
            ref: "Comment.post",
            many: true
        }),

        reactions: relationship({
            label: "Reactions",
            ref: "Reaction.post",
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
    }
});

export default Post;