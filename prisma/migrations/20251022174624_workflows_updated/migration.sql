/*
  Warnings:

  - You are about to drop the column `data` on the `workflow` table. All the data in the column will be lost.
  - Added the required column `userId` to the `workflow` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "workflow" DROP COLUMN "data",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "workflow" ADD CONSTRAINT "workflow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
