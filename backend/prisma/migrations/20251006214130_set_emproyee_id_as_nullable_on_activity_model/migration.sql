-- DropForeignKey
ALTER TABLE "public"."activities" DROP CONSTRAINT "activities_employee_id_fkey";

-- AlterTable
ALTER TABLE "public"."activities" ALTER COLUMN "employee_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."activities" ADD CONSTRAINT "activities_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;
