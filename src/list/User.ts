import { list, graphql } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { ScalarType } from "@keystone-6/core/dist/declarations/src/types/schema/graphql-ts-schema";
import { text, password, timestamp, select, relationship, virtual, json } from "@keystone-6/core/fields";

const User = list({
    access: allowAll,
    ui: {
        label: "Utilisateurs"
    },
    fields: {
        firstname: text({
            validation: {
                isRequired: true
            }
        }),

        lastname: text({
            validation: {
                isRequired: true
            }
        }),

        picture: json({
            label: "Image",
            defaultValue: {}
        }),

        auth0Avatar: text({
            label: "Auth0 Avatar",
            defaultValue: "",
        }),

        avatar: virtual({
            label: "Avatar",
            field: graphql.field({
                type: graphql.String,
                resolve: async (root: any, args, context, info) => {
                    if (root.picture) {
                        let dt = root.picture
                        if(dt.url) {
                            return dt.url;
                        }
                    }
                    if (root.auth0Avatar) {
                        return root.auth0Avatar;
                    }
                    let base = "https://api.dicebear.com/5.x/identicon/svg";
                    return `${base}?seed=${root.firstname + "" + root.lastname}&size=256`;
                }
            })
        }),

        email: text({
            validation: {
                isRequired: true
            },
        }),

        authId: text({
            validation: {
                isRequired: true
            },
            isIndexed: 'unique',
        }),

        gender: select({
            label: "Genre",
            options: [
                { label: "Homme", value: "male" },
                { label: "Femme", value: "female" }
            ]
        }),

        role: select({
            label: "Role",
            ui: {
                displayMode: "segmented-control"
            },
            defaultValue: "reader",
            options: [
                { label: "Auteur", value: "publisher" },
                { label: "Lecteur", value: "reader" }
            ],
            validation: {
                isRequired: true
            }
        }),

        posts: relationship({
            label: "Articles",
            ref: "Post.author",
            many: true
        }),

        comments: relationship({
            label: "Commentaires",
            ref: "Comment.author",
            many: true
        }),

        reactions: relationship({
            label: "Reactions",
            ref: "Reaction.author",
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

export default User;