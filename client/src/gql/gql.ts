/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "fragment RegularUser on User {\n  id\n  username\n}": types.RegularUserFragmentDoc,
    "mutation CreatePost($text: String!, $title: String!) {\n  createPost(text: $text, title: $title) {\n    title\n    text\n    creatorId\n    points\n    _id\n  }\n}": types.CreatePostDocument,
    "query Post($startDate: String!, $limit: Float!) {\n  post(startDate: $startDate, limit: $limit) {\n    _id\n    title\n    textSnippet\n    points\n    creatorId\n  }\n}": types.PostDocument,
    "query Me {\n  me {\n    id\n    username\n  }\n}": types.MeDocument,
    "mutation ChangePassword($newPassword: String!, $token: String!) {\n  changePassword(newPassword: $newPassword, token: $token) {\n    user {\n      email\n      username\n    }\n    errors {\n      field\n      message\n    }\n  }\n}": types.ChangePasswordDocument,
    "mutation ForgotPassword($email: String!) {\n  forgotPassword(email: $email)\n}": types.ForgotPasswordDocument,
    "mutation Login($options: UserBaseInput!) {\n  login(options: $options) {\n    user {\n      ...RegularUser\n    }\n    errors {\n      field\n      message\n    }\n  }\n}": types.LoginDocument,
    "mutation Logout {\n  logout\n}": types.LogoutDocument,
    "mutation Register($options: UserRegistrationInput!) {\n  register(options: $options) {\n    user {\n      id\n      username\n    }\n    errors {\n      field\n      message\n    }\n  }\n}": types.RegisterDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment RegularUser on User {\n  id\n  username\n}"): (typeof documents)["fragment RegularUser on User {\n  id\n  username\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreatePost($text: String!, $title: String!) {\n  createPost(text: $text, title: $title) {\n    title\n    text\n    creatorId\n    points\n    _id\n  }\n}"): (typeof documents)["mutation CreatePost($text: String!, $title: String!) {\n  createPost(text: $text, title: $title) {\n    title\n    text\n    creatorId\n    points\n    _id\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Post($startDate: String!, $limit: Float!) {\n  post(startDate: $startDate, limit: $limit) {\n    _id\n    title\n    textSnippet\n    points\n    creatorId\n  }\n}"): (typeof documents)["query Post($startDate: String!, $limit: Float!) {\n  post(startDate: $startDate, limit: $limit) {\n    _id\n    title\n    textSnippet\n    points\n    creatorId\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Me {\n  me {\n    id\n    username\n  }\n}"): (typeof documents)["query Me {\n  me {\n    id\n    username\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation ChangePassword($newPassword: String!, $token: String!) {\n  changePassword(newPassword: $newPassword, token: $token) {\n    user {\n      email\n      username\n    }\n    errors {\n      field\n      message\n    }\n  }\n}"): (typeof documents)["mutation ChangePassword($newPassword: String!, $token: String!) {\n  changePassword(newPassword: $newPassword, token: $token) {\n    user {\n      email\n      username\n    }\n    errors {\n      field\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation ForgotPassword($email: String!) {\n  forgotPassword(email: $email)\n}"): (typeof documents)["mutation ForgotPassword($email: String!) {\n  forgotPassword(email: $email)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Login($options: UserBaseInput!) {\n  login(options: $options) {\n    user {\n      ...RegularUser\n    }\n    errors {\n      field\n      message\n    }\n  }\n}"): (typeof documents)["mutation Login($options: UserBaseInput!) {\n  login(options: $options) {\n    user {\n      ...RegularUser\n    }\n    errors {\n      field\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Logout {\n  logout\n}"): (typeof documents)["mutation Logout {\n  logout\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Register($options: UserRegistrationInput!) {\n  register(options: $options) {\n    user {\n      id\n      username\n    }\n    errors {\n      field\n      message\n    }\n  }\n}"): (typeof documents)["mutation Register($options: UserRegistrationInput!) {\n  register(options: $options) {\n    user {\n      id\n      username\n    }\n    errors {\n      field\n      message\n    }\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;