import { KeystoneContext } from "@keystone-6/core/types";
import IoRedis from "ioredis";

declare module 'express-serve-static-core' {
    interface Request {
        context: KeystoneContext;
    }
}

declare global {
    var redis: IoRedis;
}