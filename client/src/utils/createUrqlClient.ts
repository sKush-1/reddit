import { Cache,cacheExchange, QueryInput } from '@urql/exchange-graphcache';
import { Client, fetchExchange} from "urql";
import { LoginMutation, LogoutMutation, MeDocument, MeQuery, RegularUserFragment } from '../gql/graphql';

function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query | null) => Query | null
) {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}


export const client = new Client({
url:  "http://localhost:8000/graphql", 
exchanges: [
  cacheExchange({
    updates: {
      Mutation: {
        logout: (_result, args, cache, info) => {
          betterUpdateQuery<LogoutMutation, MeQuery>(
            cache,
            { query: MeDocument },
            _result,
            () => ({ me: null })
          );
        },
        login: (_result: LoginMutation, args, cache, info) => {
          betterUpdateQuery<LoginMutation, MeQuery>(
            cache,
            { query: MeDocument },
            _result,
            (result, query) => {
              if (result.login.errors || !result.login.user) {
                return query;
              }
              const user = result.login.user as RegularUserFragment;
              return {
                me: {
                  __typename: "User",
                  id: user.id,
                  username: user.username,
                }
              } as MeQuery;
            }
          );
        }
      }
    }
  }),
  fetchExchange,
],
fetchOptions: {
  credentials: "include",
},
});
