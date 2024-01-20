import { User, clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const filerUserForClient = (user: User) => {
  return {
    id: user.id,
    name: user.username ?? user.firstName,
    profileImageURL: user.profileImageUrl
  }
}

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
      take: 100,
      // where: {
      //   authorId: ctx.user?.id,
      // }
    });

    const users = (await clerkClient.users.getUserList({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      userId: posts.map((post) => post.authorId),
      limit: 100,
    })).map(filerUserForClient);

    // console.log(users);

    return posts.map((post) => {
      const user = users.find((user) => user.id === post.authorId);
      if (!user) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: "User not found for post"
        });
      }
      return {
        post,
        user
      }
    });
  }),

  // create: publicProcedure
  //   .input(z.object({ name: z.string().min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     // simulate a slow db call
  //     await new Promise((resolve) => setTimeout(resolve, 1000));

  //     return ctx.db.post.create({
  //       data: {
  //         name: input.name,
  //       },
  //     });
  //   }),

  // getLatest: publicProcedure.query(({ ctx }) => {
  //   return ctx.db.post.findFirst({
  //     orderBy: { createdAt: "desc" },
  //   });
  // }),
});
