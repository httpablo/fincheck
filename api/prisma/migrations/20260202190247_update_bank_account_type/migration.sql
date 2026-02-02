/*
  Warnings:

  - The values [SAVINGS,CREDIT] on the enum `bank_account_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "bank_account_type_new" AS ENUM ('CHECKING', 'CASH', 'INVESTMENT');
ALTER TABLE "bank_accounts" ALTER COLUMN "type" TYPE "bank_account_type_new" USING ("type"::text::"bank_account_type_new");
ALTER TYPE "bank_account_type" RENAME TO "bank_account_type_old";
ALTER TYPE "bank_account_type_new" RENAME TO "bank_account_type";
DROP TYPE "public"."bank_account_type_old";
COMMIT;
