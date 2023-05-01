import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { text, timestamp } from "@keystone-6/core/fields";

const NewsletterSubscription = list({
    access: (ctx) => {
        if(ctx.operation === "create" && !ctx.session) {
            return true;
        }
        return Boolean(ctx.session) && ctx.session?.role === "publisher";
    },
    ui: {
        label: "Souscription à la newsletter"
    },
    fields: {

        name: text({
            label: "Nom",
            validation: {
                isRequired: true
            }
        }),

        email: text({
            label: "Email",
            validation: {
                isRequired: true
            }
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

export default NewsletterSubscription;