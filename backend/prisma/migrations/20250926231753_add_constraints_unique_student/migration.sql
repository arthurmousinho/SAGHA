/*
  Warnings:

  - A unique constraint covering the columns `[college_id,enrollment]` on the table `students` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[college_id,user_id]` on the table `students` will be added. If there are existing duplicate values, this will fail.
  - Made the column `college_id` on table `students` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."students" DROP CONSTRAINT "students_college_id_fkey";

-- DropIndex
DROP INDEX "public"."students_college_id_key";

-- AlterTable
ALTER TABLE "public"."students" ALTER COLUMN "college_id" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "students_college_id_enrollment_key" ON "public"."students"("college_id", "enrollment");

-- CreateIndex
CREATE UNIQUE INDEX "students_college_id_user_id_key" ON "public"."students"("college_id", "user_id");

-- AddForeignKey
ALTER TABLE "public"."students" ADD CONSTRAINT "students_college_id_fkey" FOREIGN KEY ("college_id") REFERENCES "public"."colleges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
