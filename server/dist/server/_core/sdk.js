import { AXIOS_TIMEOUT_MS, COOKIE_NAME } from "@shared/const";
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import * as db from "../db";
import { ENV } from "./env";
const isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
class SDKServer {
    api;
    constructor() {
        this.api = axios.create({
            baseURL: ENV.manusApiBase,
            timeout: AXIOS_TIMEOUT_MS,
        });
    }
    async authenticateRequest(req) {
        const cookies = req.headers.cookie;
        if (!isNonEmptyString(cookies)) {
            return null;
        }
        const token = parseCookieHeader(cookies)[COOKIE_NAME];
        if (!isNonEmptyString(token)) {
            return null;
        }
        try {
            const openId = (await this.getUserInfoWithJwt({
                jwtToken: token,
                projectId: ENV.appId,
            })).openId;
            const user = await db.getUserByOpenId(openId);
            if (user) {
                return user;
            }
            console.warn("[Auth] User with valid token not found in DB:", openId);
            return null;
        }
        catch (error) {
            console.error("[Auth] Failed to authenticate request:", error);
            return null;
        }
    }
    async exchangeToken(req) {
        const res = await this.api.post("/oauth/token", req);
        return res.data;
    }
    async getUserInfo(accessToken) {
        const res = await this.api.get("/oauth/userinfo", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return res.data;
    }
    async getUserInfoWithJwt(req) {
        const res = await this.api.post("/oauth/userinfo_jwt", req);
        return res.data;
    }
}
export const sdk = new SDKServer();
