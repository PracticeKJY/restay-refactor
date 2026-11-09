import "server-only";
import clientPromise from "@/app/api/mongoDB";

// Shared read path; query semantics and the existing API response stay unchanged.
export async function findListings(filter: Record<string, unknown>) {
  const client = await clientPromise;
  return client.db("Restay").collection("listings").find(filter).toArray();
}
