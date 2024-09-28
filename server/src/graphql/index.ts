import { ApolloServer } from "@apollo/server";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "../resolvers/hello";
import { PostResolver } from "../resolvers/post";
import { UserResolver } from "../resolvers/user";


async function createApolloServer(){
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
          resolvers:[HelloResolver, PostResolver, UserResolver],
          validate: false,
        }),
      })
    
      await apolloServer.start();
      return apolloServer;
}

export default createApolloServer;