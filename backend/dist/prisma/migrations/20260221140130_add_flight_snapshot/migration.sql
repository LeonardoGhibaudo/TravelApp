/*
  Warnings:

  - You are about to drop the column `destination` on the `Flight` table. All the data in the column will be lost.
  - You are about to drop the column `origin` on the `Flight` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `Flight` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - The `status` column on the `Flight` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `arrivalAirport` to the `Flight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departureAirport` to the `Flight` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FlightStatus" AS ENUM ('SAVED', 'SELECTED', 'REMOVED');

-- AlterTable
ALTER TABLE "Flight" DROP COLUMN "destination",
DROP COLUMN "origin",
ADD COLUMN     "arrivalAirport" TEXT NOT NULL,
ADD COLUMN     "departureAirport" TEXT NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "offerId" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "FlightStatus" NOT NULL DEFAULT 'SAVED';
