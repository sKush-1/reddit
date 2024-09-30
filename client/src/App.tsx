import theme from "./theme";
import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./pages/Register";
import { Client, Provider, fetchExchange } from "urql";
import Login from "./pages/Login";
import NavBar from "./components/NavBar";
import { Cache,cacheExchange, QueryInput } from '@urql/exchange-graphcache';
import { MeDocument, LoginMutation, MeQuery, RegularUserFragment } from "./gql/graphql";

function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query | null) => Query | null
) {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}

const client = new Client({
  url: "http://localhost:8000/graphql",
  exchanges: [fetchExchange, cacheExchange({
    updates: {
      Mutation: {
        login: (result: LoginMutation, args, cache, info) => {
          betterUpdateQuery<LoginMutation, MeQuery>(
            cache,
            { query: MeDocument },
            result,
            (result, query) => {
              if (result.login.errors || !result.login.user) {
                return query;
              }
              const user = result.login.user as unknown as RegularUserFragment;
              return {
                me: {
                  __typename: "User",
                  id: user.id,
                  username: user.username,
                  ' $fragmentRefs': {
                    RegularUserFragment: user
                  }
                }
              } as MeQuery;
            }
          );
        }
      }
    }
  })],
  fetchOptions: {
    credentials: "include"
  }
});


// console.log(import.meta.env.VITE_GRAPHQL_SCHEMA)

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavBar/>
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />
  },
]);

function App() {
  return (
    <Provider value={client}>
      <ChakraProvider theme={theme}>
        <RouterProvider router={router}
         />
      </ChakraProvider>
    </Provider>
  );
}

export default App;
