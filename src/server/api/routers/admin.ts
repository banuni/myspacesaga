import { z } from "zod";
import {
    createTRPCRouter,
    privateProcedure,
} from "~/server/api/trpc";
import { db } from "~/db";
import { users } from "~/db/schema";

export const adminRouter = createTRPCRouter({
    users: privateProcedure.query(async ({ ctx }) => {
        const userId = ctx.userId;
        // make sure userId is admin
        const res = await db.select().from(users).limit(30);
        return res;

    }),
});
