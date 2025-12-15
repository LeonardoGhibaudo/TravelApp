/*
  Warnings:

  - A unique constraint covering the columns `[tripId,userId]` on the table `TripParticipant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TripParticipant_tripId_userId_key" ON "TripParticipant"("tripId", "userId");
