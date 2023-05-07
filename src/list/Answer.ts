import { list } from "@keystone-6/core";
import { timestamp, json, relationship } from "@keystone-6/core/fields";

const Answer = list({
    access: (ctx) => {
        if(["create", "update", "delete"].includes(ctx.operation)) {
            return Boolean(ctx.session?.id);
        }
        return true
    },
    ui: {
        label: "Réponse"
    },
    fields: {

        form: relationship({
            label: "Formulaire",
            ref: "Form.answers",
            many: false
        }),

        data: json({
            label: "Réponse",
            defaultValue: {}
        }),
        
        user: relationship({
            label: "Auteur",
            ref: "User.answers",
            many: false
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
                    user: {
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
                    user: {
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

export default Answer;