import { gql } from "graphql-tag";

export const createTweetMutation = gql(`
  #graphql
  mutation CreateTweet($payload: CreateTweetData!) {
    createTweet(payload: $payload) {
      id
    }
  }
`);
