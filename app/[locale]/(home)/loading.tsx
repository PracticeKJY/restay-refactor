"use client";

import { useSearchParams } from "next/navigation";
import HomeClient from "@/app/client/home-client";

export default function Loading() {
  const params = useSearchParams();
  return <HomeClient searchParams={{ category: params.get("category") ?? undefined }} initialListings={[]} loading />;
}
