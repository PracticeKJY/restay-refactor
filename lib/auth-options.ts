// // lib/auth-options.ts
// import bcrypt from "bcrypt";
// import type { AuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
// import NaverProvider from "next-auth/providers/naver";
// import KakaoProvider from "next-auth/providers/kakao";
// import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
// import clientPromise from "@/app/api/mongoDB";

// async function refreshAccessToken(token: any) {
//   // ✅ Google refresh 예시
//   // - Naver/Kakao는 각각 문서에 맞게 endpoint/params 조정 필요
//   try {
//     const refreshToken = token.refreshToken;
//     if (!refreshToken) return { ...token, error: "NoRefreshToken" };

//     const url = "https://oauth2.googleapis.com/token";

//     const body = new URLSearchParams({
//       client_id: process.env.GOOGLE_CLIENT_ID!,
//       client_secret: process.env.GOOGLE_CLIENT_SECRET!,
//       grant_type: "refresh_token",
//       refresh_token: refreshToken,
//     });

//     const res = await fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       body,
//     });

//     const refreshed = await res.json();

//     if (!res.ok) {
//       return { ...token, error: "RefreshAccessTokenError", details: refreshed };
//     }

//     // refreshed.expires_in: seconds
//     const accessTokenExpires = Date.now() + (refreshed.expires_in ?? 3600) * 1000;

//     return {
//       ...token,
//       accessToken: refreshed.access_token,
//       accessTokenExpires,
//       // refresh_token은 보통 다시 안 내려오므로 기존 유지
//       refreshToken: refreshed.refresh_token ?? token.refreshToken,
//       error: undefined,
//     };
//   } catch (e) {
//     return { ...token, error: "RefreshAccessTokenError" };
//   }
// }

// export const authOptions: AuthOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       allowDangerousEmailAccountLinking: true,
//     }),
//     NaverProvider({
//       clientId: process.env.NAVER_CLIENT_ID!,
//       clientSecret: process.env.NAVER_CLIENT_SECRET!,
//       allowDangerousEmailAccountLinking: true,
//     }),
//     KakaoProvider({
//       // ⚠️ Kakao는 보통 REST API 키를 clientId로 사용합니다(현재 env가 NEXT_PUBLIC_로 되어있는데 서버에서도 사용 가능).
//       clientId: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID!,
//       clientSecret: process.env.NEXT_PUBLIC_KAKAO_CLIENT_SECRET!,
//       allowDangerousEmailAccountLinking: true,
//     }),
//     CredentialsProvider({
//       name: "credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Invalid credentials");
//         }

//         const client = await clientPromise;
//         const db = client.db("Restay");
//         const user: any = await db.collection("users").findOne({ email: credentials.email });

//         if (!user) throw new Error("해당 이메일은 없음");

//         const pwcheck = await bcrypt.compare(credentials.password, user.password);
//         if (!pwcheck) throw new Error("Invalid credentials");

//         return user;
//       },
//     }),
//   ],

//   session: {
//     strategy: "jwt",
//     maxAge: 30 * 24 * 60 * 60, // 30일
//   },

//   callbacks: {
//     async jwt({ token, user, account }: any) {
//       // ✅ 최초 로그인 시(user/account 존재)
//       if (user) {
//         token.user = {
//           name: user.name,
//           email: user.email,
//           image: user.image,
//         };
//       }

//       // ✅ OAuth 로그인이라면 account에 access_token/refresh_token/expiry가 들어옵니다
//       if (account) {
//         if (account.access_token) token.accessToken = account.access_token;
//         if (account.refresh_token) token.refreshToken = account.refresh_token;

//         // expires_at은 초 단위인 경우가 많음
//         if (account.expires_at) token.accessTokenExpires = account.expires_at * 1000;
//         // expires_in만 주는 경우도 있음
//         if (!token.accessTokenExpires && account.expires_in) {
//           token.accessTokenExpires = Date.now() + account.expires_in * 1000;
//         }
//       }

//       // ✅ Credentials 로그인에는 accessToken이 없을 수 있음(그럼 Authorization 주입도 안 함)
//       if (!token.accessToken || !token.accessTokenExpires) return token;

//       // ✅ 만료 전이면 그대로
//       if (Date.now() < token.accessTokenExpires - 30_000) return token;

//       // ✅ 만료면 refresh 시도 (여기서는 Google 예시)
//       return await refreshAccessToken(token);
//     },

//     async session({ session, token }: any) {
//       session.user = token.user ?? session.user;
//       session.accessToken = token.accessToken;
//       session.error = token.error;
//       return session;
//     },
//   },

//   pages: {
//     signIn: "/",
//   },

//   debug: process.env.NODE_ENV === "development",
//   secret: process.env.NEXTAUTH_SECRET ?? process.env.mongoDB_SECRET, // 가능하면 NEXTAUTH_SECRET 사용 권장
//   adapter: MongoDBAdapter(clientPromise),
// };
