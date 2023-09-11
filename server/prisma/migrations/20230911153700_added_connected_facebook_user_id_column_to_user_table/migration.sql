/*
  Warnings:

  - A unique constraint covering the columns `[connected_facebook_user_id]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "connected_facebook_user_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_connected_facebook_user_id_key" ON "user"("connected_facebook_user_id");
