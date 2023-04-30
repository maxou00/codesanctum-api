import { KeystoneContext, SessionStrategy } from '@keystone-6/core/types';
import { Lists } from ".keystone/types"
import jwt from "jsonwebtoken";
import cookies from "cookie";

let sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'The SESSION_SECRET environment variable must be set in production'
    );
  } else {
    sessionSecret = '-- DEV COOKIE SECRET; CHANGE ME --';
  }
}

const jwtSession: SessionStrategy<any> = {
  async start(args: { data: Lists.User.Item, context: KeystoneContext }) {
    let innerData = { ...args.data };
    let signed = jwt.sign({ userId: innerData.id }, process.env.SESSION_SECRET || "", {
      expiresIn: "30d",
      audience: ['softwaiz'],
      issuer: "blog/api"
    });

    let cookie = cookies.serialize("token", signed, {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      path: '/',
      secure: true,
      sameSite: "none"
    });

    args.context.res?.setHeader("set-cookie", cookie);
    args.context.session = args.data;
    return signed;
  },

  async end(args) {
    let cookie = cookies.serialize("token", "", {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      path: '/',
      secure: true,
    });
    args.context.session = undefined;
    args.context.res?.setHeader("set-cookie", cookie);
    return Promise.resolve();
  },

  async get(args) {
    let authorization = args.context?.req?.headers['authorization'];
    let cookieHeader = args.context.req?.headers['cookie'];

    if (cookieHeader) {
      let parsed = cookies.parse(cookieHeader);
      if (parsed.token) {
        try {
          let sessionData: any = jwt.verify(parsed.token, process.env.SESSION_SECRET || "", {
            audience: ["softwaiz"],
            issuer: "blog/api"
          })
          let user = await args.context.db.User.findOne({
            where: {
              id: sessionData.userId
            }
          });
          args.context.session = user;
          return Promise.resolve(user);
        } catch (error) {
          console.log(error);
          return undefined;
        }
      }
    }

    if (authorization) {
      let token = authorization.replace(/^bearer/i, "").trim();
      try {
        let sessionData: any = jwt.verify(token, process.env.SESSION_SECRET || "", {
          audience: ["softwaiz"],
          issuer: "blog/api"
        })
        let user = await args.context.db.User.findOne({
          where: {
            id: sessionData.userId
          }
        });
        args.context.session = user;
        return Promise.resolve(user);
      } catch (error) {
        return Promise.resolve(undefined);
      }
    }

    return Promise.resolve(undefined);
  }
}

export { jwtSession };