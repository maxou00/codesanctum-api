import { list } from "@keystone-6/core";
import { timestamp, json, relationship } from "@keystone-6/core/fields";

const Form = list({
    access: (ctx) => {
        if(["create", "update", "delete"].includes(ctx.operation)) {
            return Boolean(ctx.session?.id);
        }
        return true
    },
    ui: {
        label: "Formulaire"
    },
    fields: {

        data: json({
            label: "Données du formulaire",
            defaultValue: {}
        }),
        
        user: relationship({
            label: "Auteur",
            ref: "User.forms",
            many: false
        }),

        answers: relationship({
            label: "Réponses",
            ref: "Answer.form",
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

export default Form;