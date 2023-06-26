import { MongoClient } from "mongodb"

const url = process.env.DATABASE_URL as string

let connectDB: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  if (!(global as any)._mongo) {
    ;(global as any)._mongo = new MongoClient(url).connect()
  }
  connectDB = (global as any)._mongo
} else {
  connectDB = new MongoClient(url).connect()
}
export default connectDB
