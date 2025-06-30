import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",     // chemin des tables (à créer)
  out: "./drizzle",                 // dossier de migrations
  dialect: "postgresql",            // dialecte pour Drizzle v2
  dbCredentials: {
    url: process.env.XATA_DATABASE_URL!,
  },
}); 