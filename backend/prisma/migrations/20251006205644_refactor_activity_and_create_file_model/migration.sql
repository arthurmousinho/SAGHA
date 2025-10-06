/*
  Warnings:

  - You are about to drop the column `certificate_file_url` on the `activities` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[certificate_id]` on the table `activities` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `certificate_id` to the `activities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."activities" DROP COLUMN "certificate_file_url",
ADD COLUMN     "certificate_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."files" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "size_in_bytes" INTEGER NOT NULL,
    "mime_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "files_url_key" ON "public"."files"("url");

-- CreateIndex
CREATE UNIQUE INDEX "activities_certificate_id_key" ON "public"."activities"("certificate_id");

-- AddForeignKey
ALTER TABLE "public"."activities" ADD CONSTRAINT "activities_certificate_id_fkey" FOREIGN KEY ("certificate_id") REFERENCES "public"."files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
