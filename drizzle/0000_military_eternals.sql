CREATE TABLE "invoices" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer" varchar(120) NOT NULL,
	"email" varchar(160) NOT NULL,
	"value" numeric NOT NULL,
	"description" varchar(255),
	"status" varchar(32) DEFAULT 'open',
	"created_at" timestamp DEFAULT now()
);
