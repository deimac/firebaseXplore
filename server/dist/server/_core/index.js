"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var express_1 = __importDefault(require("express"));
var http_1 = require("http");
var express_2 = require("@trpc/server/adapters/express");
var routers_js_1 = require("../routers.js");
var context_js_1 = require("./context.js");
var path_1 = __importDefault(require("path"));
var url_1 = require("url");
// Helper para obter o __dirname em módulos ES
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = path_1.default.dirname(__filename);
function startServer() {
    return __awaiter(this, void 0, void 0, function () {
        var app, server, staticPath, PORT;
        return __generator(this, function (_a) {
            app = (0, express_1.default)();
            server = (0, http_1.createServer)(app);
            // Body parser com limite de tamanho aumentado
            app.use(express_1.default.json({ limit: "50mb" }));
            app.use(express_1.default.urlencoded({ limit: "50mb", extended: true }));
            // Rota para a API tRPC
            app.use("/api/trpc", (0, express_2.createExpressMiddleware)({
                router: routers_js_1.appRouter,
                createContext: context_js_1.createContext,
            }));
            staticPath = path_1.default.resolve(__dirname, "public");
            // Serve os arquivos estáticos do frontend
            app.use(express_1.default.static(staticPath));
            // Fallback para Single Page Application (SPA)
            // Envia o index.html para todas as outras rotas que não são da API
            app.get("*", function (req, res) {
                res.sendFile(path_1.default.resolve(staticPath, "index.html"));
            });
            PORT = process.env.PORT || 8080;
            server.listen(PORT, function () {
                console.log("\uD83D\uDE80 Servidor unificado iniciado na porta ".concat(PORT));
                console.log("\u2714 Servindo frontend de: ".concat(staticPath));
            });
            return [2 /*return*/];
        });
    });
}
startServer().catch(function (error) {
    console.error("❌ Falha ao iniciar o servidor:", error);
    process.exit(1);
});
