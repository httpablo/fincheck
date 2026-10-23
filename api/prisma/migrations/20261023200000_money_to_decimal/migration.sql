-- AlterTable
ALTER TABLE "bank_accounts" ALTER COLUMN "initial_balance" SET DATA TYPE DECIMAL(12,2) USING ROUND("initial_balance"::numeric, 2);

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "value" SET DATA TYPE DECIMAL(12,2) USING ROUND("value"::numeric, 2);
