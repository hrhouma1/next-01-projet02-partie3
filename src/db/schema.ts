import { pgTable, integer, varchar, numeric, timestamp } from "drizzle-orm/pg-core";

export const invoices = pgTable("invoices", {
  id:          integer("id").primaryKey().notNull(),
  customer:    varchar("customer", { length: 120 }).notNull(),
  email:       varchar("email",    { length: 160 }).notNull(),
  value:       numeric("value").notNull(),
  description: varchar("description", { length: 255 }),
  status:      varchar("status", { length: 32 }).default("open"),
  createdAt:   timestamp("created_at").defaultNow(),
});