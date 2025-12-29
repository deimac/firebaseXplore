"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
var systemRouter_js_1 = require("./_core/systemRouter.js");
var trpc_js_1 = require("./_core/trpc.js");
var zod_1 = require("zod");
var db = __importStar(require("./db.js"));
var server_1 = require("@trpc/server");
exports.appRouter = (0, trpc_js_1.router)({
    system: systemRouter_js_1.systemRouter,
    travels: (0, trpc_js_1.router)({
        list: trpc_js_1.publicProcedure.query(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.getAllTravels()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }),
        getById: trpc_js_1.publicProcedure
            .input(zod_1.z.object({ id: zod_1.z.number() }))
            .query(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var input = _b.input;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, db.getTravelById(input.id)];
                    case 1: return [2 /*return*/, _c.sent()];
                }
            });
        }); }),
    }),
    categories: (0, trpc_js_1.router)({
        list: trpc_js_1.publicProcedure.query(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.getAllCategories()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }),
    }),
    companySettings: (0, trpc_js_1.router)({
        get: trpc_js_1.publicProcedure.query(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.getCompanySettings()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }),
        update: trpc_js_1.publicProcedure
            .input(zod_1.z.object({
            id: zod_1.z.number(),
            companyName: zod_1.z.string().optional(),
            cnpj: zod_1.z.string().optional(),
            foundedDate: zod_1.z.string().optional(),
            email: zod_1.z.string().optional(),
            phone: zod_1.z.string().optional(),
            whatsapp: zod_1.z.string().optional(),
            instagram: zod_1.z.string().optional(),
            facebook: zod_1.z.string().optional(),
            linkedin: zod_1.z.string().optional(),
            twitter: zod_1.z.string().optional(),
            quotationLink: zod_1.z.string().optional(),
            googleAnalyticsId: zod_1.z.string().optional(),
        }))
            .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var id, settings;
            var input = _b.input;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        id = input.id, settings = __rest(input, ["id"]);
                        return [4 /*yield*/, db.updateCompanySettings(id, settings)];
                    case 1:
                        _c.sent();
                        return [2 /*return*/, { success: true }];
                }
            });
        }); }),
    }),
    heroSlides: (0, trpc_js_1.router)({
        list: trpc_js_1.publicProcedure.query(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.getAllHeroSlides()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }),
        listActive: trpc_js_1.publicProcedure.query(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.getActiveHeroSlides()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }),
        getById: trpc_js_1.publicProcedure
            .input(zod_1.z.object({ id: zod_1.z.number() }))
            .query(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var input = _b.input;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, db.getHeroSlideById(input.id)];
                    case 1: return [2 /*return*/, _c.sent()];
                }
            });
        }); }),
        create: trpc_js_1.publicProcedure
            .input(zod_1.z.object({
            imageUrl: zod_1.z.string(),
            title: zod_1.z.string(),
            subtitle: zod_1.z.string().optional(),
            order: zod_1.z.number().default(0),
            isActive: zod_1.z.number().default(1),
        }))
            .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var input = _b.input;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, db.createHeroSlide(input)];
                    case 1: return [2 /*return*/, _c.sent()];
                }
            });
        }); }),
        update: trpc_js_1.publicProcedure
            .input(zod_1.z.object({
            id: zod_1.z.number(),
            imageUrl: zod_1.z.string().optional(),
            title: zod_1.z.string().optional(),
            subtitle: zod_1.z.string().optional(),
            order: zod_1.z.number().optional(),
            isActive: zod_1.z.number().optional(),
        }))
            .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var id, data;
            var input = _b.input;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        id = input.id, data = __rest(input, ["id"]);
                        return [4 /*yield*/, db.updateHeroSlide(id, data)];
                    case 1:
                        _c.sent();
                        return [2 /*return*/, { success: true }];
                }
            });
        }); }),
        delete: trpc_js_1.publicProcedure
            .input(zod_1.z.object({ id: zod_1.z.number() }))
            .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var input = _b.input;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, db.deleteHeroSlide(input.id)];
                    case 1:
                        _c.sent();
                        return [2 /*return*/, { success: true }];
                }
            });
        }); }),
        /*
        uploadImage: publicProcedure
          .input(
            z.object({
              fileName: z.string(),
              fileData: z.string(),
              mimeType: z.string(),
            })
          )
          .mutation(async ({ input }) => {
            
            const buffer = Buffer.from(input.fileData, "base64");
            const randomSuffix = crypto.randomBytes(8).toString("hex");
            const ext = input.fileName.split(".").pop() || "jpg";
            const fileKey = `hero-slides/${randomSuffix}.${ext}`;
            const { url } = await storagePut(fileKey, buffer, input.mimeType);
            
            return { url };
          }),
        */
    }),
    quotations: (0, trpc_js_1.router)({
        create: trpc_js_1.publicProcedure
            .input(zod_1.z.object({
            name: zod_1.z.string(),
            email: zod_1.z.string().email(),
            phone: zod_1.z.string().optional(),
            destination: zod_1.z.string(),
            departureDate: zod_1.z.string().optional(),
            returnDate: zod_1.z.string().optional(),
            travelers: zod_1.z.number(),
            budget: zod_1.z.string().optional(),
            message: zod_1.z.string().optional(),
        }))
            .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var input = _b.input;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, db.createQuotation(__assign(__assign({}, input), { status: "pending" }))];
                    case 1: return [2 /*return*/, _c.sent()];
                }
            });
        }); }),
        list: trpc_js_1.protectedProcedure.query(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var ctx = _b.ctx;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (ctx.user.role !== "admin") {
                            throw new server_1.TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
                        }
                        return [4 /*yield*/, db.getAllQuotations()];
                    case 1: return [2 /*return*/, _c.sent()];
                }
            });
        }); }),
        updateStatus: trpc_js_1.protectedProcedure
            .input(zod_1.z.object({
            id: zod_1.z.number(),
            status: zod_1.z.enum(["pending", "contacted", "completed", "cancelled"]),
        }))
            .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var ctx = _b.ctx, input = _b.input;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (ctx.user.role !== "admin") {
                            throw new server_1.TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
                        }
                        return [4 /*yield*/, db.updateQuotationStatus(input.id, input.status)];
                    case 1:
                        _c.sent();
                        return [2 /*return*/, { success: true }];
                }
            });
        }); }),
        delete: trpc_js_1.protectedProcedure
            .input(zod_1.z.object({ id: zod_1.z.number() }))
            .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var ctx = _b.ctx, input = _b.input;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (ctx.user.role !== "admin") {
                            throw new server_1.TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
                        }
                        return [4 /*yield*/, db.deleteQuotation(input.id)];
                    case 1:
                        _c.sent();
                        return [2 /*return*/, { success: true }];
                }
            });
        }); }),
    }),
    reviews: (0, trpc_js_1.router)({
        create: trpc_js_1.publicProcedure
            .input(zod_1.z.object({
            authorId: zod_1.z.number(),
            rating: zod_1.z.number().min(1).max(5),
            comment: zod_1.z.string().min(10),
        }))
            .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var input = _b.input;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, db.createReview(__assign(__assign({}, input), { status: "pending" }))];
                    case 1:
                        _c.sent();
                        return [2 /*return*/, { success: true }];
                }
            });
        }); }),
        list: trpc_js_1.protectedProcedure.query(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var ctx = _b.ctx;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (ctx.user.role !== "admin") {
                            throw new server_1.TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
                        }
                        return [4 /*yield*/, db.getAllReviews()];
                    case 1: return [2 /*return*/, _c.sent()];
                }
            });
        }); }),
        listApproved: trpc_js_1.publicProcedure.query(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.getApprovedReviews()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }),
        updateStatus: trpc_js_1.protectedProcedure
            .input(zod_1.z.object({
            id: zod_1.z.number(),
            status: zod_1.z.enum(["pending", "approved", "rejected"]),
        }))
            .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var ctx = _b.ctx, input = _b.input;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (ctx.user.role !== "admin") {
                            throw new server_1.TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
                        }
                        return [4 /*yield*/, db.updateReviewStatus(input.id, input.status)];
                    case 1:
                        _c.sent();
                        return [2 /*return*/, { success: true }];
                }
            });
        }); }),
        delete: trpc_js_1.protectedProcedure
            .input(zod_1.z.object({ id: zod_1.z.number() }))
            .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var ctx = _b.ctx, input = _b.input;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (ctx.user.role !== "admin") {
                            throw new server_1.TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
                        }
                        return [4 /*yield*/, db.deleteReview(input.id)];
                    case 1:
                        _c.sent();
                        return [2 /*return*/, { success: true }];
                }
            });
        }); }),
    }),
});
