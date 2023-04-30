import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { timestamp, json, relationship, text } from "@keystone-6/core/fields";

const Tag = list({
    ui: {
        label: "Tags"
    },
    access: allowAll,
    fields: {
        label: text({
            label: "Libellé du tag",
            defaultValue: ""
        }),

        posts: relationship({
            label: "Articles",
            ref: "Post.tags"
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

export default Tag;