import { prismaClient } from "../../clients/db";

import { GraphqlContext } from "../../interfaces";
import { User } from "@prisma/client";
import UserService from "../../services/user";

const queries = {
  verifyGoogleToken: async (parent: any, { token }: { token: string }) => {
    return await UserService.verifyGoogleAuthToken(token);
  },
  getCurrentUser: async (parent: any, args: any, context: GraphqlContext) => {
    const id = context.user?.id;
    if (!id) return null;

    return await UserService.getUserById(id);
  },
  getUserById: async (
    parent: any,
    { id }: { id: string },
    context: GraphqlContext
  ) => UserService.getUserById(id),
};

const extraResolvers = {
  User: {
    tweets: (parent: User) =>
      prismaClient.tweet.findMany({
        where: { author: { id: parent.id } },
        orderBy: { createdAt: "desc" },
      }),
  },
};

export const resolvers = { queries, extraResolvers };
