-- CreateTable
CREATE TABLE "Images" (
    "image_id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "meta" JSONB NOT NULL,
    "image_kit_id" TEXT NOT NULL,
    "avatar" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Images_pkey" PRIMARY KEY ("image_id")
);

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Accounts"("account_id") ON DELETE RESTRICT ON UPDATE CASCADE;
