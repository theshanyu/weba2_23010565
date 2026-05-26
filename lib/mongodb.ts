import { MongoClient, Db } from "mongodb";

function getUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Please add MONGODB_URI to .env.local");
  }
  return uri;
}

const options = {};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | undefined;

function getClientPromise(): Promise<MongoClient> {
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = new MongoClient(getUri(), options).connect();
    }
    return global._mongoClientPromise;
  }
  if (!clientPromise) {
    clientPromise = new MongoClient(getUri(), options).connect();
  }
  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db("dairyflat");
}
