import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";
const dbName = process.env.DB_NAME || "wanderlust";

if (!process.env.MONGODB_URI && process.env.NODE_ENV === "production") {
  console.warn("WARNING: MONGODB_URI is not set in environment variables.");
}

declare global {
  var _mongoClient: MongoClient | undefined;
}

const client =
  global._mongoClient ||
  (global._mongoClient = new MongoClient(
    uri || "mongodb://127.0.0.1:27017/wanderlust"
  ));
const db = client.db(dbName);

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
          },
        }
      : {}),
  },
  secret: process.env.BETTER_AUTH_SECRET || "",
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000",
});
