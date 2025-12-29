"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.systemRouter = void 0;
var zod_1 = require("zod");
var notification_1 = require("./notification");
var trpc_1 = require("./trpc");
var db = __importStar(require("../db"));
var firebase_1 = require("./firebase");
var schema_1 = require("../../drizzle/schema");
var drizzle_orm_1 = require("drizzle-orm");
exports.systemRouter = (0, trpc_1.router)({
    health: trpc_1.publicProcedure
        .input(zod_1.z.object({
        timestamp: zod_1.z.number().min(0, "timestamp cannot be negative"),
    }))
        .query(function () { return ({
        ok: true,
    }); }),
    notifyOwner: trpc_1.adminProcedure
        .input(zod_1.z.object({
        title: zod_1.z.string().min(1, "title is required"),
        content: zod_1.z.string().min(1, "content is required"),
    }))
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var delivered;
        var input = _b.input;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, notification_1.notifyOwner)(input)];
                case 1:
                    delivered = _c.sent();
                    return [2 /*return*/, {
                            success: delivered,
                        }];
            }
        });
    }); }),
    syncUser: trpc_1.publicProcedure
        .input(zod_1.z.object({
        token: zod_1.z.string(),
        firebaseUid: zod_1.z.string(),
        email: zod_1.z.string().email().nullable().optional(),
        name: zod_1.z.string().nullable().optional(),
    }))
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var decodedToken, error_1, database, existingUser, newUserPayload, newUser;
        var _c, _d;
        var input = _b.input;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, firebase_1.auth.verifyIdToken(input.token)];
                case 1:
                    decodedToken = _e.sent();
                    if (decodedToken.uid !== input.firebaseUid) {
                        throw new Error("Token UID does not match payload UID.");
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _e.sent();
                    console.error("Firebase token verification failed:", error_1);
                    throw new Error("Invalid authentication token.");
                case 3: return [4 /*yield*/, db.getDb()];
                case 4:
                    database = _e.sent();
                    if (!database) {
                        throw new Error("Database not available");
                    }
                    return [4 /*yield*/, db.getUserByFirebaseUid(input.firebaseUid)];
                case 5:
                    existingUser = _e.sent();
                    if (!existingUser) return [3 /*break*/, 7];
                    // If the user exists, update their last sign-in time and name/email if they've changed.
                    return [4 /*yield*/, database
                            .update(schema_1.users)
                            .set({
                            lastSignedIn: new Date(),
                            name: (_c = input.name) !== null && _c !== void 0 ? _c : existingUser.name,
                            email: (_d = input.email) !== null && _d !== void 0 ? _d : existingUser.email,
                        })
                            .where((0, drizzle_orm_1.eq)(schema_1.users.firebaseUid, input.firebaseUid))];
                case 6:
                    // If the user exists, update their last sign-in time and name/email if they've changed.
                    _e.sent();
                    return [2 /*return*/, { status: "updated", user: existingUser }];
                case 7:
                    newUserPayload = {
                        firebaseUid: input.firebaseUid,
                        name: input.name,
                        email: input.email,
                        lastSignedIn: new Date(),
                    };
                    return [4 /*yield*/, database.insert(schema_1.users).values(newUserPayload)];
                case 8:
                    _e.sent();
                    return [4 /*yield*/, db.getUserByFirebaseUid(input.firebaseUid)];
                case 9:
                    newUser = _e.sent();
                    return [2 /*return*/, { status: "created", user: newUser }];
            }
        });
    }); }),
});
