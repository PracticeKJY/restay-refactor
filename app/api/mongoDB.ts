// app/api/_lib/mongodb.ts
import { MongoClient } from "mongodb";

const uri = process.env.DATABASE_URL as string;

if (!uri) {
  throw new Error("❌ DATABASE_URL is not defined");
}

/**
 * Next.js dev 환경에서 HMR 때문에 MongoClient가
 * 계속 새로 생성되는 걸 막기 위한 글로벌 캐시
 */
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  const client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
