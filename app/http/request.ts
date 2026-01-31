import type { AxiosError, AxiosRequestConfig, Method } from "axios";
import { httpClient } from "./client";
import { type HttpConfig, HttpError, type HttpResponse, toHttpResponse } from "./types";

// ───────────────────────────────────────────────────────────────────────────────
// 안전 유틸: 타입 가드 & 헤더 읽기
// ───────────────────────────────────────────────────────────────────────────────
const hasMessage = (v: unknown): v is { message: string } => typeof (v as { message?: unknown })?.message === "string";

const isPlainObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;

const isAxiosError = (e: unknown): e is AxiosError => isPlainObject(e) && "isAxiosError" in e;

const readHeader = (headers: unknown, name: string): string | undefined => {
  if (!isPlainObject(headers)) return undefined;
  const target = name.toLowerCase();
  for (const [k, v] of Object.entries(headers)) {
    if (k.toLowerCase() === target && typeof v === "string") return v;
  }
  return undefined;
};

// ───────────────────────────────────────────────────────────────────────────────
// 에러 메시지 안전 생성
// ───────────────────────────────────────────────────────────────────────────────
function safeMessage(input: unknown, fallback: string): string {
  if (typeof input === "string") return input;
  if (hasMessage(input)) return input.message;
  if (isPlainObject(input)) {
    try {
      return JSON.stringify(input);
    } catch {
      /* intentionally ignore stringify errors */
    }
  }
  return fallback;
}

// ───────────────────────────────────────────────────────────────────────────────
// 요청 설정 빌드
// ───────────────────────────────────────────────────────────────────────────────
function buildRequestConfig<T>(method: Method, url: string, config?: HttpConfig & { data?: unknown }): AxiosRequestConfig<T> {
  const req: AxiosRequestConfig<T> = { method, url };
  if (config?.params) req.params = config.params;
  if (config?.headers) req.headers = config.headers;
  if ("data" in (config ?? {})) req.data = config?.data as T;
  if (config?.signal) req.signal = config.signal;
  if (typeof config?.timeout === "number") req.timeout = config.timeout;
  if (typeof config?.baseURL === "string") req.baseURL = config.baseURL;
  if (typeof config?.withCredentials === "boolean") req.withCredentials = config.withCredentials;
  if (config?.paramsSerializer) req.paramsSerializer = { serialize: config.paramsSerializer };
  return req;
}

// ───────────────────────────────────────────────────────────────────────────────
// HttpError 생성 (기능 유지: requestId 부여 포함)
// ───────────────────────────────────────────────────────────────────────────────
function buildHttpError(method: Method, url: string, err: unknown): HttpError {
  let status: number | undefined;
  let code: string | undefined;
  let details: unknown;
  let requestId: string | undefined;

  if (isAxiosError(err)) {
    status = typeof err.response?.status === "number" ? err.response?.status : undefined;
    code = typeof err.code === "string" ? err.code : undefined;
    details = err.response?.data;
    const h = err.response?.headers;
    requestId = readHeader(h, "x-request-id") ?? readHeader(h, "x-requestid");
  }

  let fallback = "HTTP " + String(method).toUpperCase() + " " + url + " failed";
  if (status !== undefined) fallback += " (" + String(status) + ")";

  const message = safeMessage(details, safeMessage(hasMessage(err) ? err.message : undefined, fallback));

  const meta: { status?: number; code?: string; details?: unknown } = {};
  if (status !== undefined) meta.status = status;
  if (code !== undefined) meta.code = code;
  if (details !== undefined) meta.details = details;

  // 주: 기존 코드 시그니처를 유지합니다(원래 cause 옵션 사용하셨으므로 보존).
  const e = new HttpError(message, meta, { cause: err });

  // requestId를 안전하게 부여(타입 확장 없이, 비열거로 부여)
  if (requestId) {
    Object.defineProperty(e, "requestId", {
      value: requestId,
      enumerable: false,
      writable: false,
      configurable: true,
    });
  }
  return e;
}

// ───────────────────────────────────────────────────────────────────────────────
// 범용 요청
// ───────────────────────────────────────────────────────────────────────────────
export const request = async <T>(method: Method, url: string, config?: HttpConfig & { data?: unknown }): Promise<HttpResponse<T>> => {
  const c = httpClient();
  const req = buildRequestConfig<T>(method, url, config);
  try {
    const res = await c.request<T>(req);
    return toHttpResponse<T>(res);
  } catch (err) {
    throw buildHttpError(method, url, err);
  }
};

// ───────────────────────────────────────────────────────────────────────────────
// 메서드
// ───────────────────────────────────────────────────────────────────────────────
export const GET = <T>(url: string, config?: HttpConfig) => request<T>("get", url, config);

export const POST = <T, B = unknown>(url: string, body?: B, config?: HttpConfig) => request<T>("post", url, { ...(config ?? {}), data: body });

export const PUT = <T, B = unknown>(url: string, body?: B, config?: HttpConfig) => request<T>("put", url, { ...(config ?? {}), data: body });

export const PATCH = <T, B = unknown>(url: string, body?: B, config?: HttpConfig) => request<T>("patch", url, { ...(config ?? {}), data: body });

export const DELETE = <T = unknown>(url: string, config?: HttpConfig) => request<T>("delete", url, config);
