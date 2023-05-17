import { config } from '@keystone-6/core';
import { parse } from "graphql";
import { lists } from './schema';
import { jwtSession } from './auth';
import AssetRouter from './src/routers/asset';
import { config as dotenvConfig } from "dotenv";
import { readFileSync } from 'fs';
import { mergeSchemas } from '@graphql-tools/schema';
import { getAuthenticatedUser } from './src/resolvers/auth/getAuthenticatedUser';
import postBySlug from './src/resolvers/posts/postBySlug';
import { signinWithGoogle } from './src/resolvers/auth/signinWithGoogle';
import writePost from './src/resolvers/posts/writePost';
import paginatedPosts from './src/resolvers/posts/paginatedPosts';
import { signinWithGithub } from './src/resolvers/auth/signinWithGithub';
import { getFormAnswer } from './src/resolvers/forms/formAnswer';

dotenvConfig();

const schemaExtension = parse(
  readFileSync("./extension.graphql", { encoding: "utf-8" }),
);

export default config({
  db: {
    provider: "postgresql",
    url: process.env.DATABASE_URL || "",
  },
  lists,
  session: jwtSession,
  ui: {
    isDisabled: true
  },
  graphql: {
    path: "/graphql",
    playground: "apollo",
  },
  extendGraphqlSchema: schema => mergeSchemas({
    schemas: [schema],
    typeDefs: schemaExtension,
    resolvers: {
      Form: {
        answer: getFormAnswer
      },
      Query: {
        me: getAuthenticatedUser,
        postBySlug,
        paginatedPosts,
        formAnswer: getFormAnswer
      },
      Mutation: {
        signinWithGoogle,
        signinWithGithub,
        writePost: writePost
      }
    }
  }),
  server: {
    cors: true,
    extendExpressApp(app, context) {

      app.use(async (req, res, next) => {
        req.context = await context.withRequest(req, res);
        next();
      })

      app.use("/assets", AssetRouter);
    },
  }
});
