// app/api/auth/signup/route.ts
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import clientPromise from "@/app/api/mongoDB";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, password } = body;

    const hash = await bcrypt.hash(password, 10);

    const client = await clientPromise;
    const db = client.db("Restay");

    await db.collection("users").insertOne({
      email,
      name,
      password: hash,
      createdAt: new Date(),
    });

    return NextResponse.redirect(new URL("/", req.url), { status: 302 });
  } catch (e) {
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
