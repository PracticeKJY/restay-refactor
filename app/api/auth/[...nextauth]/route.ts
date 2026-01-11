// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth";

export const runtime = "nodejs";

export const { GET, POST } = handlers;
