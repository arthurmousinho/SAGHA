/*
  Warnings:

  - You are about to drop the column `category_id` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the `activity_categories` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category` to the `activities` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."ActivityCategoryType" AS ENUM ('EXTENCAO', 'ENSINO', 'PESQUISA', 'ESTAGIO', 'REPRESENTACAO_ESTUDANTIL');

-- DropForeignKey
ALTER TABLE "public"."activities" DROP CONSTRAINT "activities_category_id_fkey";

-- AlterTable
ALTER TABLE "public"."activities" DROP COLUMN "category_id",
ADD COLUMN     "category" "public"."ActivityCategoryType" NOT NULL;

-- DropTable
DROP TABLE "public"."activity_categories";
