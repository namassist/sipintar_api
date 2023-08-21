/*
  Warnings:

  - You are about to alter the column `waktu_realisasi` on the `jadwal_pertemuans` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `waktu_presensi` on the `presensi_mahasiswas` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `jadwal_pertemuans` MODIFY `waktu_realisasi` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `presensi_mahasiswas` MODIFY `waktu_presensi` DATETIME NOT NULL;
