/*
  Warnings:

  - You are about to drop the column `arrivalAirport` on the `Flight` table. All the data in the column will be lost.
  - You are about to drop the column `departureAirport` on the `Flight` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `Flight` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - Added the required column `currency` to the `Flight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destination` to the `Flight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `offerId` to the `Flight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `origin` to the `Flight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tripId` to the `Flight` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Flight" DROP COLUMN "arrivalAirport",
DROP COLUMN "departureAirport",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "currency" TEXT NOT NULL,
ADD COLUMN     "destination" TEXT NOT NULL,
ADD COLUMN     "offerId" TEXT NOT NULL,
ADD COLUMN     "origin" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'SELECTED',
ADD COLUMN     "tripId" TEXT NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
