import { prismaClient } from "../clients/db";

export interface CreateTweetPayload {
  content: string;
  imageURL?: string;
  userId: string;
}

class TweetService {
  public static createTweet(payload: CreateTweetPayload) {
    return prismaClient.tweet.create({
      data: {
        content: payload.content,
        imageURL: payload.imageURL,
        author: { connect: { id: payload.userId } },
      },
    });
  }

  public static getAllTweets() {
    return prismaClient.tweet.findMany({ orderBy: { createdAt: "desc" } });
  }
}

export default TweetService;