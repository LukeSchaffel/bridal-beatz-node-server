-- CreateEnum
CREATE TYPE "CLIENT_TYPE_ENUM" AS ENUM ('bride', 'groom', 'planner', 'venue');

-- AlterTable
ALTER TABLE "Accounts" ADD COLUMN     "client_type" "CLIENT_TYPE_ENUM";
