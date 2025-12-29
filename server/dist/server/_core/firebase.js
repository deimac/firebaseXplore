"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.firestore = exports.auth = void 0;
var firebase_admin_1 = __importDefault(require("firebase-admin"));
// NOTA: Esta configuração assume que as credenciais do Firebase
// serão fornecidas através de variáveis de ambiente ou da conta de serviço padrão
// no ambiente do Firebase/Google Cloud. Nenhuma chave precisa ser codificada aqui.
try {
    if (firebase_admin_1.default.apps.length === 0) {
        firebase_admin_1.default.initializeApp();
        console.log("Firebase Admin SDK inicializado com sucesso.");
    }
    else {
        console.log("Firebase Admin SDK já estava inicializado.");
    }
}
catch (error) {
    console.error("Erro ao inicializar o Firebase Admin SDK:", error);
    // Se a inicialização falhar, o aplicativo não pode continuar de forma segura.
    // Em um ambiente de produção, você pode querer sair do processo.
    // process.exit(1);
}
exports.auth = firebase_admin_1.default.auth();
exports.firestore = firebase_admin_1.default.firestore();
exports.storage = firebase_admin_1.default.storage();
