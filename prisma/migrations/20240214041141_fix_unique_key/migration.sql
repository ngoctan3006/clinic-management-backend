/*
  Warnings:

  - A unique constraint covering the columns `[doctorId,serviceId]` on the table `DoctorService` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DoctorService_doctorId_serviceId_key" ON "DoctorService"("doctorId", "serviceId");
