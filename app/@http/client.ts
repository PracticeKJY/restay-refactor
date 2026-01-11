// client.ts (v5 + App Router 추천: 쿠키 기반만)
import axios, { type AxiosError, type AxiosInstance } from "axios";

let _client: AxiosInstance | null = null;

export function httpClient(): AxiosInstance {
  if (_client) return _client;

  const instance = axios.create({
    timeout: 30_000,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });

  instance.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      // 401이면 그냥 상위(UI)에서 로그인 유도하면 됩니다.
      return Promise.reject(error);
    }
  );

  _client = instance;
  return instance;
}
