import { AXIOS_TIMEOUT_MS, COOKIE_NAME, ONE_YEAR_MS } from "../shared/const.js";
import { ForbiddenError } from "../shared/_core/errors.js";
import axios, { type AxiosInstance } from "axios";
import { parse as parseCookieHeader } from "cookie";
import type { Request } from "express";
import type { User } from "../drizzle/schema.js";
import * as db from "../db.js";
import { ENV } from "./env.js";
import type {
  ExchangeTokenRequest,
  ExchangeTokenResponse,
  GetUserInfoResponse,
  GetUserInfoWithJwtRequest,
  GetUserInfoWithJwtResponse,
} from "./types/authTypes.js";

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0;

export type SessionPayload = {
  openId: string;
  appId: string;
  name: string;
};

class SDKServer {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: ENV.manusApiBase,
      timeout: AXIOS_TIMEOUT_MS,
    });
  }

  async authenticateRequest(req: Request): Promise<User | null> {
    // --- START: Input validation ---
    if (!isNonEmptyString(ENV.appId)) {
      console.error("[Auth] Missing or invalid ENV.appId. Cannot authenticate request.");
      return null;
    }

    const cookies = req.headers.cookie;
    if (!isNonEmptyString(cookies)) {
      return null;
    }

    const rawToken = parseCookieHeader(cookies)[COOKIE_NAME];
    if (typeof rawToken !== "string" || rawToken.length === 0) {
      return null;
    }
    const token: string = rawToken;
    // --- END: Input validation ---

    try {
      const openId = (await this.getUserInfoWithJwt({
        jwtToken: token,
        projectId: ENV.appId, // Now safe, as ENV.appId is validated above
      })).openId;

      const user = await db.getUserByFirebaseUid(openId);

      if (user) {
        return user;
      }

      console.warn("[Auth] User with valid token not found in DB:", openId);
      return null;
    } catch (error) {
      console.error("[Auth] Failed to authenticate request:", error);
      return null;
    }
  }

  async exchangeToken(
    req: ExchangeTokenRequest
  ): Promise<ExchangeTokenResponse> {
    const res = await this.api.post<ExchangeTokenResponse>(
      "/oauth/token",
      req
    );
    return res.data;
  }

  async getUserInfo(accessToken: string): Promise<GetUserInfoResponse> {
    const res = await this.api.get<GetUserInfoResponse>("/oauth/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data;
  }
  
  private async getUserInfoWithJwt(
    req: GetUserInfoWithJwtRequest
  ): Promise<GetUserInfoWithJwtResponse> {
    const res = await this.api.post<GetUserInfoWithJwtResponse>(
      "/oauth/userinfo_jwt",
      req
    );
    return res.data;
  }
}

export const sdk = new SDKServer();
