import { AXIOS_TIMEOUT_MS, COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { ForbiddenError } from "@shared/_core/errors";
import axios, { type AxiosInstance } from "axios";
import { parse as parseCookieHeader } from "cookie";
import type { Request } from "express";
import type { User } from "../../drizzle/schema";
import * as db from "../db";
import { ENV } from "./env";
import type {
  ExchangeTokenRequest,
  ExchangeTokenResponse,
  GetUserInfoResponse,
  GetUserInfoWithJwtRequest,
  GetUserInfoWithJwtResponse,
} from "./types/manusTypes";

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
