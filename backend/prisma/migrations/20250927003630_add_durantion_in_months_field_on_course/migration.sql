/*
  Warnings:

  - Added the required column `duration_in_months` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."courses" ADD COLUMN     "duration_in_months" INTEGER NOT NULL;
