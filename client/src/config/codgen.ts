import { CodegenConfig } from '@graphql-codegen/cli'
 
const config: CodegenConfig = {
  schema: "http://localhost:8000/graphql",
  // documents: ['src/**/*.tsx/'],
  documents: "src/**/*.graphql",
  generates: {
    './src/gql/': {
      preset: 'client'
    }
  }
}
// console.log(import.meta.env.VITE_GRAPHQL_SCHEMA);

 
export default config