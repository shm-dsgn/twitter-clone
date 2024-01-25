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
          }
    }
`);