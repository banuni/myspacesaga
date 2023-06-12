import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/db";
import { users } from "~/db/schema";
import { eq } from "drizzle-orm";
import { clerkClient } from "@clerk/nextjs";

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
  }),
  create: privateProcedure.input(z.object({
    name: z.string().min(1, 'Need a name...'),
    faction: z.string().min(1, 'Need a faction...'),
    origin: z.string().min(1, 'Need an origin...'),
  })).mutation(async ({ input, ctx }) => {
    const userData = await clerkClient.users.getUser(ctx.userId)
    const email = userData.emailAddresses[0]?.emailAddress
    const res = await db.insert(users).values({
      userId: ctx.userId,
      email: email,
      name: input.name,
      faction: input.faction,
      origin: input.origin,
      balance: 0,
    })
    console.log(res)
    return {}
  }),
});
