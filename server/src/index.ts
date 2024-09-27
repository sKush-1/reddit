import { MikroORM, RequiredEntityData } from "@mikro-orm/core";
import "reflect-metadata";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import microconfig from "./mikro-orm.config";
import express from "express";
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import createApolloServer from "./graphql";

dotenv.config();

const DB_password = process.env.DB_PASSWORD;
console.log(typeof(DB_password), DB_password)

const main = async () => {
  const orm = await MikroORM.init(microconfig);
  await orm.getMigrator().up();

  const PORT = process.env.PORT || 3000;

  const app = express();

  app.use(express.json());

  app.use(
    "/graphql",
    expressMiddleware(await createApolloServer(), {
      context: async() => ({em: orm.em})
    })
  );


  app.listen(PORT, () => {
    console.log(`Server is up and listening on PORT:${PORT}`);
  });
};

main().catch((error) => {
  console.log(error);
});
