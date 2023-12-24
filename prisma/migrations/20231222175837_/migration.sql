-- CreateEnum
CREATE TYPE "GENRE_ENUM" AS ENUM ('pop', 'rock', 'rap', 'hiphop', 'country', 'randb', 'jazz', 'electronic', 'funk', 'reggae', 'disco', 'classical', 'church');

-- CreateEnum
CREATE TYPE "ACCOUNT_TYPE_ENUM" AS ENUM ('client', 'vendor', 'admin');

-- CreateEnum
CREATE TYPE "VENDOR_TYPE_ENUM" AS ENUM ('band', 'dj', 'musician');

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "first_name" VARCHAR(45) NOT NULL,
    "last_name" VARCHAR(45) NOT NULL,
    "email" VARCHAR(45) NOT NULL,
    "password_hash" VARCHAR(60) NOT NULL,
    "phone" VARCHAR(45),
    "is_admin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Accounts" (
    "account_id" SERIAL NOT NULL,
    "first_name" VARCHAR(45) NOT NULL,
    "last_name" VARCHAR(45) NOT NULL,
    "email" VARCHAR(45) NOT NULL,
    "phone" VARCHAR(45),
    "user_id" INTEGER NOT NULL,
    "type" "ACCOUNT_TYPE_ENUM" NOT NULL DEFAULT 'vendor',
    "vendor_type" "VENDOR_TYPE_ENUM",
    "genre" "GENRE_ENUM"[] DEFAULT ARRAY[]::"GENRE_ENUM"[],

    CONSTRAINT "Accounts_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "Links" (
    "link_id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "title" VARCHAR(45) NOT NULL,
    "url" VARCHAR(45) NOT NULL,

    CONSTRAINT "Links_pkey" PRIMARY KEY ("link_id")
);

-- CreateTable
CREATE TABLE "Locations" (
    "location_id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,

    CONSTRAINT "Locations_pkey" PRIMARY KEY ("location_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Accounts_email_key" ON "Accounts"("email");

-- AddForeignKey
ALTER TABLE "Accounts" ADD CONSTRAINT "Accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Links" ADD CONSTRAINT "Links_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Accounts"("account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Locations" ADD CONSTRAINT "Locations_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Accounts"("account_id") ON DELETE RESTRICT ON UPDATE CASCADE;
