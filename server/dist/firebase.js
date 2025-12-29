import admin from "firebase-admin";
// NOTA: Esta configuração assume que as credenciais do Firebase
// serão fornecidas através de variáveis de ambiente ou da conta de serviço padrão
// no ambiente do Firebase/Google Cloud. Nenhuma chave precisa ser codificada aqui.
try {
    if (admin.apps.length === 0) {
        admin.initializeApp();
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
export const auth = admin.auth();
export const firestore = admin.firestore();
export const storage = admin.storage();
