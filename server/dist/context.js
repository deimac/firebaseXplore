import * as db from "../db.js";
import { auth } from "./firebase.js"; // Importando a instância de autenticação do Firebase
/**
 * Cria o contexto para cada requisição tRPC.
 * A principal responsabilidade é verificar o token de autenticação do Firebase
 * e carregar os dados do usuário correspondente do banco de dados.
 */
export async function createContext(opts) {
    async function getUserFromHeader() {
        // Verifica se o header de autorização existe
        const authHeader = opts.req.headers.authorization;
        if (!authHeader) {
            return null;
        }
        // Extrai o token 'Bearer'
        const [scheme, token] = authHeader.split(" ");
        if (scheme !== "Bearer" || !token) {
            console.warn("[Auth] Header de autorização mal formatado.");
            return null;
        }
        try {
            // Verifica o token usando o Firebase Admin SDK
            const decodedToken = await auth.verifyIdToken(token);
            const firebaseUid = decodedToken.uid;
            // Procura o usuário no seu banco de dados pelo UID do Firebase
            // Esta parte é crucial: você precisa ter uma coluna no seu banco de dados
            // (por exemplo, `firebaseUid`) para associar o usuário do Firebase
            // ao registro do seu banco de dados.
            // Vamos assumir que `db.getUserByFirebaseUid` existe.
            const user = await db.getUserByFirebaseUid(firebaseUid);
            if (!user) {
                console.warn(`[Auth] Usuário com Firebase UID '${firebaseUid}' não encontrado no banco de dados.`);
                return null;
            }
            return user;
        }
        catch (error) {
            console.error("[Auth] Falha ao verificar o token do Firebase:", error.message);
            return null;
        }
    }
    const user = await getUserFromHeader();
    return {
        req: opts.req,
        res: opts.res,
        user,
    };
}
