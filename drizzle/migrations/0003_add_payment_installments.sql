-- Create payment_installments table
CREATE TABLE IF NOT EXISTS "payment_installments" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "event_id" uuid NOT NULL REFERENCES "events"("id") ON DELETE RESTRICT,
  "installment_type" varchar(50) NOT NULL,
  "installment_number" integer DEFAULT 1 NOT NULL,
  "amount" double precision NOT NULL,
  "due_date" date,
  "payment_date" date,
  "payment_method" varchar(50),
  "transaction_reference" varchar(100),
  "status" varchar(50) DEFAULT 'pending' NOT NULL,
  "notes" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS "payment_installments_event_id_idx" ON "payment_installments" ("event_id");
CREATE INDEX IF NOT EXISTS "payment_installments_status_idx" ON "payment_installments" ("status");
