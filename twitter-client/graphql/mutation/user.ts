import { gql } from "graphql-tag";

export const followUserMutation = gql(`
  #graphql
  mutation followUser($to: ID!) {
    followUser(to: $to)
  }
`);

export const unfollowUserMutation = gql(`
  #graphql
  mutation unfollowUser($to: ID!) {
    unfollowUser(to: $to)
  }  
`);
