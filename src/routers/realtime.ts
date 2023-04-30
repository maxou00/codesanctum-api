import { Router } from "express";
import * as Ably from "ably";

const RealtimeRouter = Router();

function generateUserToken(client: Ably.Rest, session: any) {
    return new Promise((res, rej) => {

        let caps: any = {
            [`general`]: ["subscribe", "push-subscribe"],
        }

        if (session?.itemId) {
            caps[`user:${session.itemId}`] = ["publish", "subscribe", "push-subscribe", "presence", "history", "channel-metadata"];
        }
        if (session?.data?.role === "customer") {
            caps[`customers`] = ["subscribe", "push-subscribe"];
        }
        if (session?.data?.role === "admin") {
            caps[`admins`] = ["subscribe", "push-subscribe"];
        }
        if (session?.data?.role === "agency") {
            caps[`agencies`] = ["subscribe", "push-subscribe"];
        }
        if (session?.data?.role === "owner") {
            caps[`owners`] = ["subscribe", "push-subscribe"];
        }
        if (session?.data?.role === "initiator") {
            caps[`initiators`] = ["subscribe", "push-subscribe"];
        }

        client.auth.requestToken({
            capability: caps as any,
            clientId: session.itemId,
        }, (err?: Ably.Types.ErrorInfo | null, result?: Ably.Types.TokenDetails | undefined) => {
            res(result);
        });
    })
}

RealtimeRouter.post("/auth", async (req, res) => {
    const adminKey = process.env.ABLY_API_KEY || "";
    let session = await req.context.session;
    if (session) {
        let client = new Ably.Rest(adminKey);
        let token = await generateUserToken(client, session);
        return res.json(token);
    }
    return res.status(403).json({ success: false });
})

export default RealtimeRouter;