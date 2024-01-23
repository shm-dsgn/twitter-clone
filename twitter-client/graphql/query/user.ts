import { graphql } from "@/gql";
import { gql } from 'graphql-tag';

export const verifyUserGoogleTokenQuery = gql(`
  #graphql
  query VerifyUserGoogleTokenQuery($token: String!) {
    verifyGoogleToken(token: $token)
  }
`);
