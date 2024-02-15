import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Tweet } from "@prisma/client";
import { GraphqlContext } from "../../interfaces";
import TweetService, { CreateTweetPayload } from "../../services/tweet";
import UserService from "../../services/user";



const s3Client = new S3Client({
  region: process.env.AWS_DEFAULT_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const queries = {
  getAllTweets: () =>
    TweetService.getAllTweets(),
  getSignedURLForTweet: async (
    parent: any,
    { imageType, imageName }: { imageType: string; imageName: string },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user || !ctx.user.id) throw new Error("Unauthenticated");
    const allowedImageTypes = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedImageTypes.includes(imageType))
      throw new Error("This image type is not supported");

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: `uploads/${ctx.user.id}/tweets/${imageName}-${Date.now()}`,
      ContentType: imageType,
    });
    const signedURL = await getSignedUrl(s3Client, putObjectCommand);
    return signedURL;
  },
};

const mutations = {
  createTweet: async (
    parent: any,
    { payload }: { payload: CreateTweetPayload },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) throw new Error("You are not authenticated.");

    const tweet = await TweetService.createTweet({
      ...payload,
      userId: ctx.user.id,
    });
    return tweet;
  },
};

const extraResolvers = {
  Tweet: {
    author: (parent: Tweet) =>
      UserService.getUserById(parent.authorId),
  },
};

export const resolvers = { mutations, extraResolvers, queries };
