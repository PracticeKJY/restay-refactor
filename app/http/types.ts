// types.ts
import type { AxiosResponse } from "axios";

export type HttpConfig = {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  timeout?: number;
  baseURL?: string;
  withCredentials?: boolean;

  /**
   * axios의 paramsSerializer를 간단히 감싸기 위한 타입
   * 사용 예:
   *  paramsSerializer: (params) => new URLSearchParams(params as any).toString()
   */
  paramsSerializer?: (params: unknown) => string;
};

export type HttpResponse<T> = {
  ok: boolean;
  status: number;
  data: T;
  headers: Record<string, string>;
};

/**
 * 사용자 코드에서 잡아서 상태/코드/상세를 보기 위한 커스텀 에러.
 * request.ts에서 new HttpError(message, meta, { cause }) 형태를 유지하도록 구성.
 */
export class HttpError extends Error {
  status?: number;
  code?: string;
  details?: unknown;

  constructor(message: string, meta?: { status?: number; code?: string; details?: unknown }, options?: { cause?: unknown }) {
    // TS target이 ES2022 이상이면 cause 지원, 아니면 무시될 수 있음
    super(message, options as any);
    this.name = "HttpError";
    if (meta?.status !== undefined) this.status = meta.status;
    if (meta?.code !== undefined) this.code = meta.code;
    if (meta?.details !== undefined) this.details = meta.details;
  }
}

/**
 * AxiosResponse -> HttpResponse 변환
 */
export function toHttpResponse<T>(res: AxiosResponse<T>): HttpResponse<T> {
  const headers: Record<string, string> = {};
  // axios headers는 환경/버전에 따라 객체 형태가 다를 수 있어 안전하게 변환
  const raw = res.headers as any;
  if (raw && typeof raw === "object") {
    for (const [k, v] of Object.entries(raw)) {
      if (typeof v === "string") headers[k.toLowerCase()] = v;
      else if (Array.isArray(v)) headers[k.toLowerCase()] = v.join(", ");
    }
  }

  return {
    ok: res.status >= 200 && res.status < 300,
    status: res.status,
    data: res.data,
    headers,
  };
}
