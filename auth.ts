// auth.ts (root)
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Naver from "next-auth/providers/naver";
import Kakao from "next-auth/providers/kakao";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/app/api/mongoDB";

// refreshAccessToken은 서버에서만 실행됨
async function refreshAccessToken(token: any) {
  try {
    if (!token.refreshToken) return { ...token, error: "NoRefreshToken" };

    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      }),
    });

    const refreshed = await res.json();
    if (!res.ok) return { ...token, error: "RefreshAccessTokenError", details: refreshed };

    return {
      ...token,
      accessToken: refreshed.access_token,
      accessTokenExpires: Date.now() + (refreshed.expires_in ?? 3600) * 1000,
      refreshToken: refreshed.refresh_token ?? token.refreshToken,
      error: undefined,
    };
  } catch {
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Naver({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Kakao({
      clientId: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_KAKAO_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },

      async authorize(credentials) {
        const email = typeof credentials?.email === "string" ? credentials.email : undefined;
        const password = typeof credentials?.password === "string" ? credentials.password : undefined;

        if (!email || !password) return null;

        const client = await clientPromise;
        const db = client.db("Restay");

        const user: any = await db.collection("users").findOne({ email });
        if (!user) throw new Error("해당 이메일 없음");

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) throw new Error("비밀번호 불일치");

        return {
          id: String(user._id),
          name: user.name ?? null,
          email: user.email ?? null,
          image: user.image ?? null,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      // 최초 로그인
      if (user) {
        token.user = {
          name: (user as any).name ?? null,
          email: (user as any).email ?? null,
          image: (user as any).image ?? null,
        };
      }

      // OAuth 토큰 저장
      if (account) {
        if ((account as any).access_token) token.accessToken = (account as any).access_token;
        if ((account as any).refresh_token) token.refreshToken = (account as any).refresh_token;

        if ((account as any).expires_at) token.accessTokenExpires = (account as any).expires_at * 1000;
        if (!token.accessTokenExpires && (account as any).expires_in) {
          token.accessTokenExpires = Date.now() + (account as any).expires_in * 1000;
        }
      }

      // accessToken이 없으면(=Credentials 로그인 등) refresh 로직 스킵
      if (!token.accessToken || !token.accessTokenExpires) return token;

      // 만료 전이면 그대로
      if (Date.now() < token.accessTokenExpires - 30_000) return token;

      // 만료면 refresh 시도 (Google 예시)
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      // user
      (session as any).user = (token as any).user ?? session.user;
      // accessToken
      (session as any).accessToken = (token as any).accessToken;
      // error
      (session as any).error = (token as any).error;
      return session;
    },
  },

  pages: {
    signIn: "/",
  },

  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
});
