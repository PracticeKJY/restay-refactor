// app/@component/Modal/auth-actions.ts
"use server";

import { signIn } from "@/auth";

export async function signInWithCredentials(email: string, password: string) {
  // redirect: false로 두면 클라에서 성공/실패 후 UI 제어 가능
  await signIn("credentials", {
    email,
    password,
    redirect: false,
  });
}

export async function signInWithProvider(provider: "google" | "naver" | "kakao") {
  // OAuth는 보통 redirect가 필요합니다.
  await signIn(provider, { redirect: true, redirectTo: "/" });
}
