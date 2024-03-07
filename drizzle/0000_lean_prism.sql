CREATE TABLE IF NOT EXISTS "trx" (
	"id" serial PRIMARY KEY NOT NULL,
	"trxId" varchar(256) NOT NULL,
	"amount" integer NOT NULL,
	"from" varchar(256),
	"to" varchar(256),
	"item" varchar(256),
	"isLoad" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" varchar(256) NOT NULL,
	"walletId" varchar(256) NOT NULL,
	"name" varchar(256),
	"email" varchar(256),
	"faction" varchar(256),
	"origin" varchar(256),
	"rank" varchar(256),
	"balance" integer DEFAULT 0,
	"profileImageUrl" varchar(256)
);
