import { z } from "zod";
import { notifyOwner } from "./notification";
import { adminProcedure, publicProcedure, router } from "./trpc";
import * as db from "../db";
import { auth } from "./firebase";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
export const systemRouter = router({
    health: publicProcedure
        .input(z.object({
        timestamp: z.number().min(0, "timestamp cannot be negative"),
    }))
        .query(() => ({
        ok: true,
    })),
    notifyOwner: adminProcedure
        .input(z.object({
        title: z.string().min(1, "title is required"),
        content: z.string().min(1, "content is required"),
    }))
        .mutation(async ({ input }) => {
        const delivered = await notifyOwner(input);
        return {
            success: delivered,
        };
    }),
    syncUser: publicProcedure
        .input(z.object({
        token: z.string(),
        firebaseUid: z.string(),
        email: z.string().email().nullable().optional(),
        name: z.string().nullable().optional(),
    }))
        .mutation(async ({ input }) => {
        // First, verify the token to ensure the request is legitimate.
        try {
            const decodedToken = await auth.verifyIdToken(input.token);
            if (decodedToken.uid !== input.firebaseUid) {
                throw new Error("Token UID does not match payload UID.");
            }
        }
        catch (error) {
            console.error("Firebase token verification failed:", error);
            throw new Error("Invalid authentication token.");
        }
        const database = await db.getDb();
        if (!database) {
            throw new Error("Database not available");
        }
        // Check if the user already exists in our database.
        const existingUser = await db.getUserByFirebaseUid(input.firebaseUid);
        if (existingUser) {
            // If the user exists, update their last sign-in time and name/email if they've changed.
            await database
                .update(users)
                .set({
                lastSignedIn: new Date(),
                name: input.name ?? existingUser.name,
                email: input.email ?? existingUser.email,
            })
                .where(eq(users.firebaseUid, input.firebaseUid));
            return { status: "updated", user: existingUser };
        }
        else {
            // If the user doesn't exist, create a new record for them.
            const newUserPayload = {
                firebaseUid: input.firebaseUid,
                name: input.name,
                email: input.email,
                lastSignedIn: new Date(),
            };
            await database.insert(users).values(newUserPayload);
            // Fetch the newly created user to return it
            const newUser = await db.getUserByFirebaseUid(input.firebaseUid);
            return { status: "created", user: newUser };
        }
    }),
});
