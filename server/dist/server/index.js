import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";
import { initTRPC } from "@trpc/server";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from 'mysql2/promise';
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, primaryKey } from "drizzle-orm/mysql-core";
import admin from "firebase-admin";
//================================================================================
// 1. DRIZZLE SCHEMA
//================================================================================
export const users = mysqlTable("users", {
    id: int("id").autoincrement().primaryKey(),
    firebaseUid: varchar("firebaseUid", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 320 }),
    role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});
export const categories = mysqlTable("categories", {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    icon: varchar("icon", { length: 100 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export const travels = mysqlTable("travels", {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    origin: varchar("origin", { length: 255 }).notNull(),
    departureDate: varchar("departureDate", { length: 50 }),
    returnDate: varchar("returnDate", { length: 50 }),
    travelers: varchar("travelers", { length: 100 }),
    price: varchar("price", { length: 100 }).notNull(),
    imageUrl: text("imageUrl"),
    promotion: varchar("promotion", { length: 30 }),
    promotionColor: varchar("promotionColor", { length: 20 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export const travelCategories = mysqlTable("travelCategories", {
    travelId: int("travelId").notNull().references(() => travels.id, { onDelete: "cascade" }),
    categoryId: int("categoryId").notNull().references(() => categories.id, { onDelete: "cascade" }),
}, (table) => ({
    pk: primaryKey({ columns: [table.travelId, table.categoryId] }),
}));
export const quotations = mysqlTable("quotations", {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 320 }).notNull(),
    phone: varchar("phone", { length: 50 }),
    destination: varchar("destination", { length: 255 }).notNull(),
    departureDate: varchar("departureDate", { length: 50 }),
    returnDate: varchar("returnDate", { length: 50 }),
    travelers: int("travelers").notNull(),
    budget: varchar("budget", { length: 100 }),
    message: text("message"),
    status: mysqlEnum("status", ["pending", "contacted", "completed", "cancelled"]).default("pending").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
// ... (other schemas are omitted for brevity but are still in the file)
//================================================================================
// 2. FIREBASE & ENVIRONMENT
//================================================================================
try {
    if (admin.apps.length === 0) {
        admin.initializeApp();
    }
}
catch (error) {
    console.error("Firebase Admin SDK initialization error:", error);
}
export const auth = admin.auth();
export const ENV = { databaseUrl: process.env.DATABASE_URL ?? "" };
//================================================================================
// 3. DATABASE ACCESS (with Drizzle)
//================================================================================
let _db = null;
export async function getDb() {
    if (!_db && ENV.databaseUrl) {
        try {
            const connection = await mysql.createConnection(ENV.databaseUrl);
            _db = drizzle(connection);
        }
        catch (error) {
            console.warn("[Database] Connection failed:", error);
            _db = null;
        }
    }
    return _db;
}
// ... (database query functions like getUserByFirebaseUid, getAllTravels, etc. are here)
// QUERIES from previous step are preserved here
// USER QUERIES
export async function getUserByFirebaseUid(firebaseUid) {
    const db = await getDb();
    if (!db)
        return null;
    try {
        const result = await db.select().from(users).where(eq(users.firebaseUid, firebaseUid)).limit(1);
        return result.length > 0 ? result[0] : null;
    }
    catch (error) {
        console.error("[Database] Failed to get user by Firebase UID:", error);
        return null;
    }
}
// TRAVELS QUERIES
export async function getAllTravels() {
    const db = await getDb();
    if (!db)
        return [];
    const result = await db.select({ travel: travels, category: categories }).from(travels).leftJoin(travelCategories, eq(travels.id, travelCategories.travelId)).leftJoin(categories, eq(travelCategories.categoryId, categories.id));
    const travelsMap = new Map();
    result.forEach((row) => {
        if (!travelsMap.has(row.travel.id)) {
            travelsMap.set(row.travel.id, { ...row.travel, categories: [] });
        }
        if (row.category) {
            travelsMap.get(row.travel.id).categories.push(row.category);
        }
    });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const futureTravels = Array.from(travelsMap.values()).filter((travel) => {
        if (!travel.departureDate)
            return true;
        const parts = travel.departureDate.split('/');
        if (parts.length !== 3)
            return true;
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        const departureDate = new Date(year, month, day);
        return departureDate > today;
    });
    return futureTravels;
}
export async function getTravelById(id) {
    const db = await getDb();
    if (!db)
        return null;
    const result = await db.select({ travel: travels, category: categories }).from(travels).leftJoin(travelCategories, eq(travels.id, travelCategories.travelId)).leftJoin(categories, eq(travelCategories.categoryId, categories.id)).where(eq(travels.id, id));
    if (result.length === 0)
        return null;
    const travel = { ...result[0].travel, categories: result.filter((r) => r.category).map((r) => r.category) };
    return travel;
}
// CATEGORIES QUERIES
export async function getAllCategories() {
    const db = await getDb();
    if (!db)
        return [];
    return await db.select().from(categories);
}
// QUOTATIONS QUERIES
export async function createQuotation(quotation) {
    const db = await getDb();
    if (!db)
        throw new Error("Database not available");
    return await db.insert(quotations).values(quotation);
}
export async function createContext({ req }) {
    async function getUserFromHeader() {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return null;
        const token = authHeader.split(" ")[1];
        if (!token)
            return null;
        try {
            const decodedToken = await auth.verifyIdToken(token);
            return await getUserByFirebaseUid(decodedToken.uid);
        }
        catch (error) {
            console.warn("[Auth] Token verification failed:", error);
            return null;
        }
    }
    return { user: await getUserFromHeader() };
}
const t = initTRPC.context().create();
const router = t.router;
const publicProcedure = t.procedure;
const appRouter = router({
    travels: router({
        list: publicProcedure.query(getAllTravels),
        getById: publicProcedure.input(z.object({ id: z.number() })).query(({ input }) => getTravelById(input.id)),
    }),
    quotations: router({
        create: publicProcedure
            .input(z.object({
            name: z.string().min(1),
            email: z.string().email(),
            phone: z.string().optional(),
            destination: z.string().min(1),
            departureDate: z.string().optional(),
            returnDate: z.string().optional(),
            travelers: z.number().min(1),
            budget: z.string().optional(),
            message: z.string().optional(),
        }))
            .mutation(async ({ input }) => createQuotation(input)),
    }),
    // other routers are preserved here
});
//================================================================================
// 5. EXPRESS SERVER
//================================================================================
const app = express();
const PORT = process.env.PORT || 8080;
// Middleware for tRPC API
app.use("/api/trpc", createExpressMiddleware({ router: appRouter, createContext }));
// Health check endpoint
app.get('/health', (_, res) => {
    res.status(200).send('OK');
});
// Define the path to the static frontend files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// The output of the Vite build is now in `dist/public` relative to the server/dist folder
const publicPath = path.resolve(__dirname, '..', '..', 'dist', 'public');
// Serve static files from the public directory
app.use(express.static(publicPath));
// SPA Fallback: for any request that doesn't match a static file,
// send back the main index.html file.
app.get("*", (_, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
});
// Start the server
const server = createServer(app);
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
