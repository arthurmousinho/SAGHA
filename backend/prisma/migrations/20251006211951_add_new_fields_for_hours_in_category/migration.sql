/*
  Warnings:

  - Added the required column `max_hour_limit` to the `activity_categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `max_hour_per_semester` to the `activity_categories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."activities" ALTER COLUMN "hours_approved" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."activity_categories" ADD COLUMN     "max_hour_limit" INTEGER NOT NULL,
ADD COLUMN     "max_hour_per_semester" INTEGER NOT NULL;
