"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core8 = require("@keystone-6/core");
var import_graphql = require("graphql");

// src/list/User.ts
var import_core = require("@keystone-6/core");
var import_access = require("@keystone-6/core/access");
var import_fields = require("@keystone-6/core/fields");
var User = (0, import_core.list)({
  access: import_access.allowAll,
  ui: {
    label: "Utilisateurs"
  },
  fields: {
    firstname: (0, import_fields.text)({
      validation: {
        isRequired: true
      }
    }),
    lastname: (0, import_fields.text)({
      validation: {
        isRequired: true
      }
    }),
    picture: (0, import_fields.json)({
      label: "Image",
      defaultValue: {}
    }),
    providers: (0, import_fields.json)({
      label: "Authentication Strategies",
      defaultValue: {},
      access: (args) => {
        return false;
      }
    }),
    avatar: (0, import_fields.virtual)({
      label: "Avatar",
      field: import_core.graphql.field({
        type: import_core.graphql.String,
        resolve: async (root, args, context, info) => {
          if (root.picture) {
            let dt = root.picture;
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
    email: (0, import_fields.text)({
      validation: {
        isRequired: true
      }
    }),
    gender: (0, import_fields.select)({
      label: "Genre",
      options: [
        { label: "Homme", value: "male" },
        { label: "Femme", value: "female" }
      ]
    }),
    role: (0, import_fields.select)({
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
    posts: (0, import_fields.relationship)({
      label: "Articles",
      ref: "Post.author",
      many: true
    }),
    comments: (0, import_fields.relationship)({
      label: "Commentaires",
      ref: "Comment.author",
      many: true
    }),
    reactions: (0, import_fields.relationship)({
      label: "Reactions",
      ref: "Reaction.author",
      many: true
    }),
    createdAt: (0, import_fields.timestamp)({
      defaultValue: {
        kind: "now"
      }
    }),
    updatedAt: (0, import_fields.timestamp)({})
  },
  db: {
    idField: {
      kind: "uuid"
    }
  }
});
var User_default = User;

// src/list/Post.ts
var import_core2 = require("@keystone-6/core");
var import_access2 = require("@keystone-6/core/access");
var import_fields2 = require("@keystone-6/core/fields");
var Post = (0, import_core2.list)({
  access: import_access2.allowAll,
  ui: {
    label: "Article"
  },
  fields: {
    metadata: (0, import_fields2.json)({
      label: "Metadata",
      defaultValue: {}
    }),
    cover: (0, import_fields2.json)({
      label: "Cover",
      defaultValue: {}
    }),
    content: (0, import_fields2.json)({
      label: "Contenu",
      defaultValue: {}
    }),
    published: (0, import_fields2.checkbox)({
      label: "Publi\xE9",
      defaultValue: true
    }),
    tags: (0, import_fields2.relationship)({
      label: "Tags associ\xE9s",
      ref: "Tag.posts",
      many: true
    }),
    author: (0, import_fields2.relationship)({
      label: "Auteur de la publication",
      ref: "User.posts",
      many: false
    }),
    comments: (0, import_fields2.relationship)({
      label: "Commentaires",
      ref: "Comment.post",
      many: true
    }),
    reactions: (0, import_fields2.relationship)({
      label: "Reactions",
      ref: "Reaction.post",
      many: true
    }),
    createdAt: (0, import_fields2.timestamp)({
      defaultValue: {
        kind: "now"
      }
    }),
    updatedAt: (0, import_fields2.timestamp)({})
  },
  db: {
    idField: {
      kind: "uuid"
    }
  }
});
var Post_default = Post;

// src/list/Tag.ts
var import_core3 = require("@keystone-6/core");
var import_access3 = require("@keystone-6/core/access");
var import_fields3 = require("@keystone-6/core/fields");
var Tag = (0, import_core3.list)({
  ui: {
    label: "Tags"
  },
  access: import_access3.allowAll,
  fields: {
    label: (0, import_fields3.text)({
      label: "Libell\xE9 du tag",
      defaultValue: ""
    }),
    posts: (0, import_fields3.relationship)({
      label: "Articles",
      ref: "Post.tags"
    }),
    createdAt: (0, import_fields3.timestamp)({
      defaultValue: {
        kind: "now"
      }
    })
  },
  db: {
    idField: {
      kind: "uuid"
    }
  }
});
var Tag_default = Tag;

// src/list/Comment.ts
var import_core4 = require("@keystone-6/core");
var import_fields4 = require("@keystone-6/core/fields");
var Comment = (0, import_core4.list)({
  access: (ctx) => {
    if (["create", "update", "delete"].includes(ctx.operation)) {
      return Boolean(ctx.session?.id);
    }
    return true;
  },
  ui: {
    label: "Commentaire"
  },
  fields: {
    content: (0, import_fields4.json)({
      label: "Contenu",
      defaultValue: {}
    }),
    author: (0, import_fields4.relationship)({
      label: "Auteur du commentaire",
      ref: "User.comments",
      many: false
    }),
    post: (0, import_fields4.relationship)({
      label: "Article comment\xE9",
      ref: "Post.comments",
      many: false
    }),
    parent: (0, import_fields4.relationship)({
      label: "Commentaire comment\xE9",
      ref: "Comment.comments",
      many: false
    }),
    comments: (0, import_fields4.relationship)({
      label: "Commentaires",
      ref: "Comment.parent",
      many: true
    }),
    reactions: (0, import_fields4.relationship)({
      label: "Reactions",
      ref: "Reaction.comment",
      many: true
    }),
    createdAt: (0, import_fields4.timestamp)({
      defaultValue: {
        kind: "now"
      }
    }),
    updatedAt: (0, import_fields4.timestamp)({})
  },
  db: {
    idField: {
      kind: "uuid"
    }
  },
  hooks: {
    resolveInput(args) {
      if (args.operation === "create") {
        let output = {
          ...args.inputData,
          author: {
            connect: {
              id: args.context.session.id
            }
          }
        };
        return output;
      }
      if (args.operation === "update") {
        let output = {
          ...args.inputData,
          author: {
            connect: {
              id: args.context.session.id
            }
          }
        };
        return output;
      }
      return args.resolvedData;
    }
  }
});
var Comment_default = Comment;

// src/list/Reaction.ts
var import_core5 = require("@keystone-6/core");
var import_access4 = require("@keystone-6/core/access");
var import_fields5 = require("@keystone-6/core/fields");
var Reaction = (0, import_core5.list)({
  ui: {
    label: "Reaction"
  },
  access: import_access4.allowAll,
  fields: {
    type: (0, import_fields5.select)({
      options: [
        {
          label: "Like",
          value: "LIKE"
        },
        {
          label: "Love",
          value: "LOVE"
        },
        {
          label: "Inspire",
          value: "INSPIRE"
        }
      ]
    }),
    post: (0, import_fields5.relationship)({
      label: "Article",
      ref: "Post.reactions"
    }),
    comment: (0, import_fields5.relationship)({
      label: "Commentaire",
      ref: "Comment.reactions"
    }),
    author: (0, import_fields5.relationship)({
      label: "Utilisateur",
      ref: "User.reactions"
    }),
    createdAt: (0, import_fields5.timestamp)({
      defaultValue: {
        kind: "now"
      }
    })
  },
  db: {
    idField: {
      kind: "uuid"
    }
  }
});
var Reaction_default = Reaction;

// src/list/Message.ts
var import_core6 = require("@keystone-6/core");
var import_fields6 = require("@keystone-6/core/fields");
var Message = (0, import_core6.list)({
  access: (ctx) => {
    if (ctx.operation === "create" && !ctx.session) {
      return true;
    }
    return Boolean(ctx.session) && ctx.session?.role === "publisher";
  },
  ui: {
    label: "Contact"
  },
  fields: {
    name: (0, import_fields6.text)({
      label: "Nom",
      validation: {
        isRequired: true
      }
    }),
    email: (0, import_fields6.text)({
      label: "Email",
      validation: {
        isRequired: true
      }
    }),
    message: (0, import_fields6.text)({
      label: "Message",
      validation: {
        isRequired: true
      }
    }),
    createdAt: (0, import_fields6.timestamp)({
      defaultValue: {
        kind: "now"
      }
    })
  },
  db: {
    idField: {
      kind: "uuid"
    }
  }
});
var Message_default = Message;

// src/list/NewsLetterSubscription.ts
var import_core7 = require("@keystone-6/core");
var import_fields7 = require("@keystone-6/core/fields");
var NewsletterSubscription = (0, import_core7.list)({
  access: (ctx) => {
    if (ctx.operation === "create" && !ctx.session) {
      return true;
    }
    return Boolean(ctx.session) && ctx.session?.role === "publisher";
  },
  ui: {
    label: "Souscription \xE0 la newsletter"
  },
  fields: {
    name: (0, import_fields7.text)({
      label: "Nom",
      validation: {
        isRequired: true
      }
    }),
    email: (0, import_fields7.text)({
      label: "Email",
      validation: {
        isRequired: true
      }
    }),
    createdAt: (0, import_fields7.timestamp)({
      defaultValue: {
        kind: "now"
      }
    })
  },
  db: {
    idField: {
      kind: "uuid"
    }
  }
});
var NewsLetterSubscription_default = NewsletterSubscription;

// schema.ts
var lists = {
  Message: Message_default,
  NewsletterSubscription: NewsLetterSubscription_default,
  User: User_default,
  Post: Post_default,
  Tag: Tag_default,
  Comment: Comment_default,
  Reaction: Reaction_default
};

// auth.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var import_cookie = __toESM(require("cookie"));
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "The SESSION_SECRET environment variable must be set in production"
    );
  } else {
    sessionSecret = "-- DEV COOKIE SECRET; CHANGE ME --";
  }
}
var jwtSession = {
  async start(args) {
    let innerData = { ...args.data };
    let signed = import_jsonwebtoken.default.sign({ userId: innerData.id }, process.env.SESSION_SECRET || "", {
      expiresIn: "30d",
      audience: ["softwaiz"],
      issuer: "blog/api"
    });
    let cookie = import_cookie.default.serialize("token", signed, {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3),
      path: "/",
      secure: true,
      sameSite: "none"
    });
    args.context.res?.setHeader("set-cookie", cookie);
    args.context.session = args.data;
    return signed;
  },
  async end(args) {
    let cookie = import_cookie.default.serialize("token", "", {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3),
      path: "/",
      secure: true
    });
    args.context.session = void 0;
    args.context.res?.setHeader("set-cookie", cookie);
    return Promise.resolve();
  },
  async get(args) {
    let authorization = args.context?.req?.headers["authorization"];
    let cookieHeader = args.context.req?.headers["cookie"];
    if (cookieHeader) {
      let parsed = import_cookie.default.parse(cookieHeader);
      if (parsed.token) {
        try {
          let sessionData = import_jsonwebtoken.default.verify(parsed.token, process.env.SESSION_SECRET || "", {
            audience: ["softwaiz"],
            issuer: "blog/api"
          });
          let user = await args.context.db.User.findOne({
            where: {
              id: sessionData.userId
            }
          });
          args.context.session = user;
          return Promise.resolve(user);
        } catch (error) {
          console.log(error);
          return void 0;
        }
      }
    }
    if (authorization) {
      let token = authorization.replace(/^bearer/i, "").trim();
      try {
        let sessionData = import_jsonwebtoken.default.verify(token, process.env.SESSION_SECRET || "", {
          audience: ["softwaiz"],
          issuer: "blog/api"
        });
        let user = await args.context.db.User.findOne({
          where: {
            id: sessionData.userId
          }
        });
        args.context.session = user;
        return Promise.resolve(user);
      } catch (error) {
        return Promise.resolve(void 0);
      }
    }
    return Promise.resolve(void 0);
  }
};

// src/routers/asset.ts
var import_express = require("express");
var import_uuid = require("uuid");
var import_path = require("path");

// src/core/utils.ts
var import_aws_sdk = require("aws-sdk");
var import_ioredis = __toESM(require("ioredis"));
function getS3Client() {
  let client = new import_aws_sdk.S3({
    signatureVersion: "v4",
    credentials: {
      accessKeyId: process.env.BUCKET_ACCESS_KEY || "",
      secretAccessKey: process.env.BUCKET_ACCESS_SECRET || ""
    },
    endpoint: process.env.BUCKET_ENDPOINT,
    s3BucketEndpoint: true
  });
  let conf = {
    bucketName: process.env.BUCKET_NAME,
    bucketUrl: process.env.BUCKET_ENDPOINT,
    bucketPublicUrl: process.env.BUCKET_PUBLIC_URL,
    accessKey: process.env.BUCKET_ACCESS_KEY,
    accessSecret: process.env.BUCKET_ACCESS_SECRET
  };
  return [conf, client];
}

// src/routers/asset.ts
var AssetRouter = (0, import_express.Router)();
AssetRouter.get("/upload", async (req, res) => {
  let fileName = req.query.name;
  if (fileName) {
    let uniqueName = (0, import_uuid.v4)() + fileName.toLowerCase();
    let finalName = (0, import_path.join)("public", uniqueName);
    let [s3Config, client] = getS3Client();
    let uploadUrl = client.getSignedUrl("putObject", {
      Bucket: s3Config.bucketName || "",
      Key: finalName,
      Expires: 30 * 60
    });
    let downloadUrl = `${s3Config.bucketPublicUrl}/${finalName}`;
    return res.json({
      success: true,
      uploadUrl,
      downloadUrl,
      uniqueName,
      filePath: finalName
    });
  }
  return res.status(400).json({
    success: false
  });
});
var asset_default = AssetRouter;

// keystone.ts
var import_dotenv = require("dotenv");
var import_fs = require("fs");
var import_schema2 = require("@graphql-tools/schema");

// src/resolvers/auth/authenticatedItem.ts
var getAuthenticatedUser = async (root, args, context, info) => {
  if (!context.session?.id) {
    return null;
  }
  return context.session;
};

// src/resolvers/posts/postBySlug.ts
var postBySlug = async (root, args, context, info) => {
  let { slug } = args;
  const client = context.prisma;
  let source = await client.post.findFirst({
    where: {
      metadata: {
        path: ["slug"],
        equals: slug
      }
    }
  });
  return source;
};
var postBySlug_default = postBySlug;

// src/core/google.ts
var import_google_auth_library = require("google-auth-library");
var import_node_fetch = __toESM(require("node-fetch"));
var google = {
  clientId: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  redirectUri: "https://api-test.codesanctum.org/auth/google/callback"
};
async function getUserWithAccessToken(accessToken) {
  return (0, import_node_fetch.default)(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    }
  ).then((res) => res.json()).then((data) => {
    console.log(data);
    return data;
  }).catch((err) => {
    console.log(err);
    return void 0;
  });
}

// src/resolvers/auth/signinWithGoogle.ts
var signinWithGoogle = async (root, args, context, info) => {
  console.log("Args: ", args);
  let profile = await getUserWithAccessToken(args.accessToken);
  console.log("Google Profile: ", profile);
  if (!profile) {
    return null;
  }
  let client = context.prisma;
  let user = await client.user.findFirst({
    where: {
      AND: [
        {
          providers: {
            path: ["type"],
            equals: "google"
          }
        },
        {
          providers: {
            path: ["sub"],
            equals: profile.sub || ""
          }
        }
      ]
    }
  });
  if (user) {
    let token2 = await context.sessionStrategy?.start({ data: user, context });
    return {
      accessToken: token2,
      user
    };
  }
  let name = profile.name;
  let [firstName, lastName] = (name || "").split(" ");
  user = await client.user.create({
    data: {
      firstname: profile.given_name || firstName,
      lastname: profile.family_name || lastName,
      email: profile.email || "",
      picture: {
        url: profile.picture || ""
      }
    }
  });
  let token = await context.sessionStrategy?.start({ data: user, context });
  return {
    accessToken: token,
    user
  };
};

// src/resolvers/posts/writePost.ts
var import_uuid2 = require("uuid");
var writePost = async (root, args, context, info) => {
  if (!context.session.id) {
    return null;
  }
  let body = args.data;
  const client = context.prisma;
  let valid = true;
  if (valid) {
    if (body.id) {
      let source = await client.post.findUnique({
        where: {
          id: body.id
        }
      });
      if (source) {
        let copy = { ...source };
        let previousTags = await client.tag.findMany({ where: { posts: { id: { equals: body.id } } } });
        let connected = [];
        let disconnected = [];
        previousTags.forEach((previous) => {
          let found = body.tags.findIndex((tag) => tag === previous.id);
          if (found < 0) {
            disconnected.push({ id: previous.id });
          }
        });
        body.tags.forEach((tag) => {
          let exists = previousTags.findIndex((t) => t.id === tag);
          if (exists > 0) {
            connected.push({ id: tag });
          }
        });
        copy.content = body.content;
        copy.cover = body.cover;
        copy.published = body.published;
        copy.metadata = body.metadata;
        copy.updatedAt = new Date();
        delete copy.id;
        let update = await client.post.update({
          where: {
            id: source.id
          },
          data: {
            ...copy,
            tags: {
              connect: connected,
              disconnect: disconnected
            }
          }
        });
        return update;
      }
    }
    let post = await client.post.create({
      data: {
        id: (0, import_uuid2.v4)(),
        metadata: body.metadata,
        cover: body.cover,
        content: body.content,
        published: body.published,
        author: {
          connectOrCreate: {
            where: {
              authId: process.env.USER_AUTHID || ""
            },
            create: {
              id: (0, import_uuid2.v4)(),
              authId: process.env.USER_AUTHID || "",
              firstname: "Maximilien",
              lastname: "COMLAN",
              email: "maximiliencomlan05@gmail.com"
            }
          }
        },
        tags: {
          connect: body.tags.map((it) => {
            return { id: it };
          })
        },
        createdAt: new Date(Date.now())
      }
    });
    return post;
  }
  return null;
};
var writePost_default = writePost;

// src/resolvers/posts/paginatedPosts.ts
var paginatedPosts = async (root, args, context, info) => {
  let { pageSize: perPage = 15, currentPage = 1 } = args;
  const client = context.prisma;
  let count = await client.post.count();
  let totalPages = Math.ceil(count / perPage);
  let page = await client.post.findMany({
    orderBy: [
      { createdAt: "desc" },
      { updatedAt: "desc" }
    ],
    take: perPage,
    skip: perPage * (currentPage - 1)
  });
  const pagination = {
    count,
    pages: totalPages,
    currentPage,
    items: page
  };
  return pagination;
};
var paginatedPosts_default = paginatedPosts;

// keystone.ts
(0, import_dotenv.config)();
var schemaExtension = (0, import_graphql.parse)(
  (0, import_fs.readFileSync)("./extension.graphql", { encoding: "utf-8" })
);
var keystone_default = (0, import_core8.config)({
  db: {
    provider: "postgresql",
    url: process.env.DATABASE_URL || ""
  },
  lists,
  session: jwtSession,
  ui: {
    isDisabled: true
  },
  graphql: {
    path: "/graphql",
    playground: "apollo"
  },
  extendGraphqlSchema: (schema) => (0, import_schema2.mergeSchemas)({
    schemas: [schema],
    typeDefs: schemaExtension,
    resolvers: {
      Query: {
        me: getAuthenticatedUser,
        postBySlug: postBySlug_default,
        paginatedPosts: paginatedPosts_default
      },
      Mutation: {
        signinWithGoogle,
        writePost: writePost_default
      }
    }
  }),
  server: {
    cors: true,
    extendExpressApp(app, context) {
      app.use(async (req, res, next) => {
        req.context = await context.withRequest(req, res);
        next();
      });
      app.use("/assets", asset_default);
    }
  }
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
