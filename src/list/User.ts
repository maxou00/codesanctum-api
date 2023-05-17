import { list, graphql } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { text, timestamp, select, relationship, virtual, json, checkbox, integer } from "@keystone-6/core/fields";

const User = list({
    access: allowAll,
    ui: {
        label: "Utilisateurs"
    },
    fields: {
        firstname: text({
            label: "Prenom",
            validation: {
                isRequired: true
            }
        }),
        lastname: text({
            label: "Nom",
            validation: {
                isRequired: true
            }
        }),
        picture: json({
            label: "Image",
            defaultValue: {}
        }),
        providers: json({
            label: "Authentication Strategies",
            defaultValue: {},
            access: (args) => {
                return false;
            }
        }),
        avatar: virtual({
            label: "Avatar",
            field: graphql.field({
                type: graphql.String,
                resolve: async (root: any, args, context, info) => {
                    if (root.picture) {
                        let dt = root.picture
                        if (dt.url) {
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
            label: "Email",
            validation: {
                isRequired: true
            },
        }),
        phoneNumber: text({
            label: "Numero de téléphone",
            validation: {
                isRequired: true
            },
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
                { label: "System Admin", value: "admin" },
                { label: "Auteur", value: "publisher" },
                { label: "Lecteur", value: "reader" }
            ],
            validation: {
                isRequired: true
            }
        }),
        forms: relationship({
            label: "Formulaires",
            ref: "Form.user",
            many: true
        }),
        answers: relationship({
            label: "Reponses",
            ref: "Answer.user",
            many: true
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
        level: integer({
            label: "Niveau associé au profil",
            defaultValue: 0
        }),
        verified: checkbox({
            label: "Compte vérifié",
            defaultValue: false,
        }),
        approved: text({
            label: "Profil approuvé pour la cohorte",
            validation: {
                isRequired: true
            }
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