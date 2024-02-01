import { gql } from "graphql-tag";

export const verifyUserGoogleTokenQuery = gql(`#graphql
query VerifyUserGoogleToken($token: String!) {
    verifyGoogleToken(token: $token)
}
`);

export const getCurrentUserQuery = gql(`#graphql
    query GetCurrentUser {
        getCurrentUser {
            id
            firstName
            lastName
            email
            profileImageURL
            tweets {
                id
                content
                author {
                    id
                    firstName
                    lastName
                    profileImageURL
                }
            }
          }
    }
`);

export const getUserByIdQuery = gql(`#graphql
    query GetUserById($id: ID!) {
        getUserById(id: $id) {
            id
            firstName
            lastName
            profileImageURL
            tweets {
                id
                content
                author {
                    id
                    firstName
                    lastName
                    profileImageURL
                }
            }
          }
    }
`);