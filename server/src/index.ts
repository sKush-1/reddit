import { MikroORM } from "@mikro-orm/core";
import "reflect-metadata";
import { __prod__, COOKIENAME } from "./constants";
import microconfig from "./mikro-orm.config";
import express from "express";
import dotenv from "dotenv";
import { expressMiddleware } from "@apollo/server/express4";
import createApolloServer from "./graphql";
import RedisStore from "connect-redis";
import session from "express-session";
import { createClient } from "redis";
import cors from "cors"

let redisClient = createClient();
redisClient.connect().catch(console.error);
redisClient.on('error', (err) => console.log('Redis Client Error', err));

dotenv.config();

const main = async () => {
  
  const orm = await MikroORM.init(microconfig);
  await orm.getMigrator().up();

  const PORT = process.env.PORT || 3000;

  const app = express();

  // Initialize Redis store.
  let redisStore = new RedisStore({
    client: redisClient,
    prefix: "reddit:",
    disableTouch: true,
  });

  const corsOptions: cors.CorsOptions = {
    origin: process.env.FRONTEND_URL, // Replace with your allowed origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  };
  
  app.use(cors(corsOptions));

  // Initialize session storage BEFORE GraphQL middleware.
  app.use(
    session({
      name: COOKIENAME,
      store: redisStore,
      resave: false, // force session keep-alive (touch)
      saveUninitialized: false, // only save session when data exists
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
        sameSite: 'lax',
        secure: __prod__,
      },
      secret: process.env.SESSION_SECRET as string,
    })
  );

  app.use(express.json());

  // Initialize GraphQL after the session middleware.
  app.use(
    "/graphql",
    expressMiddleware(await createApolloServer(), {
      context: async ({ req, res }) => ({ em: orm.em, req, res, redisClient}),
    })
  );

  app.listen(PORT, () => {
    console.log(`Server is up and listening on PORT:${PORT}`);
  });
};

main().catch((error) => {
  console.log(error);
});
