/*
  Warnings:

  - Added the required column `type` to the `Accounts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Accounts" ADD COLUMN     "type" "ACCOUNT_TYPE_ENUM" NOT NULL;
