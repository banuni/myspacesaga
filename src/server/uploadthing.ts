import { getAuth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";
import { db } from "~/db";
import { users } from "~/db/schema";

const f = createUploadthing();

const auth = (req: NextApiRequest, res: NextApiResponse) => {
    const s = getAuth(req)

    if (!s.userId) throw new Error("Unauthorized");
    return s.userId
}

// FileRouter for your app, can contain multiple FileRoutes
export const fileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    imageUploader: f({ image: { maxFileSize: "16MB" } })
        // Set permissions and file types for this FileRoute
        .middleware(({ req, res }) => {
            // This code runs on your server before upload
            const userId = auth(req, res);
            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            await db.update(users).set({ profileImageUrl: file.url }).where(eq(users.userId, metadata.userId));
        }),
} satisfies FileRouter;

export type MyFileRouter = typeof fileRouter;