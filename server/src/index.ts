import { MikroORM } from "@mikro-orm/core";
import "reflect-metadata";
import { __prod__ } from "./constants";
import microconfig from "./mikro-orm.config";
import express from "express";
import dotenv from "dotenv";
import { expressMiddleware } from "@apollo/server/express4";

import createApolloServer from "./graphql";

dotenv.config();


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
