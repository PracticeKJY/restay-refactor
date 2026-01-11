// types/next-auth.d.ts
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    accessToken?: string;
    error?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number; // epoch ms
    error?: string;
  }
}
