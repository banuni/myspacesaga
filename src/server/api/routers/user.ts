import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/db";
import { users } from "~/db/schema";
import { eq } from "drizzle-orm";

export const userRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getUser: privateProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;
    const q = await db.select().from(users).where(eq(users.userId, userId)).limit(1);
    if (q.length) {
      return { user: q[0], isNew: false }
    }

    await db.insert(users).values({ userId, name: 'new name' })
    const q2 = await db.select().from(users).where(eq(users.userId, userId)).limit(1)

    return {
      user: q2[0], isNew: true
    }
  }),
  updateUser: privateProcedure.mutation(async ({ ctx }) => {
    await db.update(users).set({ name: "teruf 22" }).where(eq(users.userId, ctx.userId));
    return {}
  })
});
