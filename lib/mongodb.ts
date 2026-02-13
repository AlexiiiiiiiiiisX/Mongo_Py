import { MongoClient, type Db } from "mongodb";

const globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local or your Vercel project settings."
    );
  }

  if (process.env.NODE_ENV === "development") {
    // In development, use a global variable so the value
    // is preserved across module reloads caused by HMR.
    if (!globalWithMongo._mongoClientPromise) {
      const client = new MongoClient(uri);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    return globalWithMongo._mongoClientPromise;
  }

  const client = new MongoClient(uri);
  return client.connect();
}

export async function getDatabase(): Promise<Db> {
  const client = await getClientPromise();
  return client.db("crud_app");
}
