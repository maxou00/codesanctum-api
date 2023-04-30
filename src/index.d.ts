import { KeystoneContext } from "@keystone-6/core/types";

declare module 'express-serve-static-core' {
    interface Request {
        context: KeystoneContext;
    }
}