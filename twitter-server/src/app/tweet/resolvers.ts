import { Tweet } from "@prisma/client";
import { prismaClient } from "../../clients/db";
import { GraphqlContext } from "../../interfaces";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

interface CreateTweetPayload {
  content: string;
  imageURL?: string;
}

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

const queries = {
  getAllTweets: () =>
    prismaClient.tweet.findMany({ orderBy: { createdAt: "desc" } }),
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
      Bucket: "soham-twitter-dev",
      Key: `upload/${
        ctx.user.id
      }/tweets/${imageName}-${Date.now()}.${imageType}`,
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

    const tweet = await prismaClient.tweet.create({
      data: {
        content: payload.content,
        imageURL: payload.imageURL,
        author: { connect: { id: ctx.user.id } },
      },
    });
    return tweet;
  },
};

const extraResolvers = {
  Tweet: {
    author: (parent: Tweet) =>
      prismaClient.user.findUnique({ where: { id: parent.authorId } }),
  },
};

export const resolvers = { mutations, extraResolvers, queries };
