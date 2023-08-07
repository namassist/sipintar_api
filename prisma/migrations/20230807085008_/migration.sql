-- CreateTable
CREATE TABLE `tahun_ajarans` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jurusans` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_jurusan` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prodis` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_prodi` VARCHAR(100) NOT NULL,
    `kode_prodi` VARCHAR(100) NOT NULL,
    `jurusan_id` INTEGER NOT NULL,

    UNIQUE INDEX `prodis_kode_prodi_key`(`kode_prodi`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kelas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_kelas` VARCHAR(100) NOT NULL,
    `tahun_ajaran_id` INTEGER NOT NULL,
    `prodi_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `token` VARCHAR(255) NULL,
    `role` ENUM('Admin', 'Dosen', 'Mahasiswa') NOT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(100) NOT NULL,
    `user_id` INTEGER NOT NULL,

    UNIQUE INDEX `Admin_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mahasiswas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_mahasiswa` VARCHAR(100) NOT NULL,
    `nim` VARCHAR(100) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `kelas_id` INTEGER NOT NULL,

    UNIQUE INDEX `mahasiswas_nim_key`(`nim`),
    UNIQUE INDEX `mahasiswas_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dosens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_dosen` VARCHAR(100) NOT NULL,
    `nip` VARCHAR(100) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `jurusan_id` INTEGER NOT NULL,

    UNIQUE INDEX `dosens_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mata_kuliahs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kode_mk` VARCHAR(100) NOT NULL,
    `nama_mk` VARCHAR(100) NOT NULL,
    `total_jam` INTEGER NOT NULL,
    `dosen_id` INTEGER NOT NULL,
    `tahun_ajaran_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kelas_mata_kuliah` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kelas_id` INTEGER NOT NULL,
    `mata_kuliah_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jadwals` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jam_mulai` DATETIME NOT NULL,
    `jam_akhir` DATETIME NOT NULL,
    `hari` VARCHAR(100) NOT NULL,
    `ruangan` VARCHAR(100) NOT NULL,
    `kelas_id` INTEGER NOT NULL,
    `tahun_ajaran_id` INTEGER NOT NULL,
    `mata_kuliah_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jadwal_pertemuans` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hari` VARCHAR(100) NOT NULL,
    `waktu_realisasi` DATETIME NOT NULL,
    `jam_mulai` VARCHAR(100) NOT NULL,
    `jam_akhir` VARCHAR(100) NOT NULL,
    `dosen` VARCHAR(100) NOT NULL,
    `ruangan` VARCHAR(100) NOT NULL,
    `qr_code` VARCHAR(100) NOT NULL,
    `topik_perkuliahan` VARCHAR(100) NOT NULL,
    `status` BOOLEAN NOT NULL,
    `kelas_id` INTEGER NOT NULL,
    `mata_kuliah_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `presensi_mahasiswas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jadwalPertemuan_id` INTEGER NOT NULL,
    `mahasiswa_id` INTEGER NOT NULL,
    `waktu_presensi` DATETIME NOT NULL,
    `status_presensi` ENUM('Hadir', 'Sakit', 'Ijin', 'Alpa') NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `prodis` ADD CONSTRAINT `prodis_jurusan_id_fkey` FOREIGN KEY (`jurusan_id`) REFERENCES `jurusans`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kelas` ADD CONSTRAINT `kelas_prodi_id_fkey` FOREIGN KEY (`prodi_id`) REFERENCES `prodis`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kelas` ADD CONSTRAINT `kelas_tahun_ajaran_id_fkey` FOREIGN KEY (`tahun_ajaran_id`) REFERENCES `tahun_ajarans`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Admin` ADD CONSTRAINT `Admin_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mahasiswas` ADD CONSTRAINT `mahasiswas_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mahasiswas` ADD CONSTRAINT `mahasiswas_kelas_id_fkey` FOREIGN KEY (`kelas_id`) REFERENCES `kelas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dosens` ADD CONSTRAINT `dosens_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dosens` ADD CONSTRAINT `dosens_jurusan_id_fkey` FOREIGN KEY (`jurusan_id`) REFERENCES `jurusans`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mata_kuliahs` ADD CONSTRAINT `mata_kuliahs_tahun_ajaran_id_fkey` FOREIGN KEY (`tahun_ajaran_id`) REFERENCES `tahun_ajarans`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mata_kuliahs` ADD CONSTRAINT `mata_kuliahs_dosen_id_fkey` FOREIGN KEY (`dosen_id`) REFERENCES `dosens`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kelas_mata_kuliah` ADD CONSTRAINT `kelas_mata_kuliah_kelas_id_fkey` FOREIGN KEY (`kelas_id`) REFERENCES `kelas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kelas_mata_kuliah` ADD CONSTRAINT `kelas_mata_kuliah_mata_kuliah_id_fkey` FOREIGN KEY (`mata_kuliah_id`) REFERENCES `mata_kuliahs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jadwals` ADD CONSTRAINT `jadwals_tahun_ajaran_id_fkey` FOREIGN KEY (`tahun_ajaran_id`) REFERENCES `tahun_ajarans`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jadwals` ADD CONSTRAINT `jadwals_kelas_id_fkey` FOREIGN KEY (`kelas_id`) REFERENCES `kelas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jadwals` ADD CONSTRAINT `jadwals_mata_kuliah_id_fkey` FOREIGN KEY (`mata_kuliah_id`) REFERENCES `mata_kuliahs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jadwal_pertemuans` ADD CONSTRAINT `jadwal_pertemuans_kelas_id_fkey` FOREIGN KEY (`kelas_id`) REFERENCES `kelas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jadwal_pertemuans` ADD CONSTRAINT `jadwal_pertemuans_mata_kuliah_id_fkey` FOREIGN KEY (`mata_kuliah_id`) REFERENCES `mata_kuliahs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `presensi_mahasiswas` ADD CONSTRAINT `presensi_mahasiswas_mahasiswa_id_fkey` FOREIGN KEY (`mahasiswa_id`) REFERENCES `mahasiswas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `presensi_mahasiswas` ADD CONSTRAINT `presensi_mahasiswas_jadwalPertemuan_id_fkey` FOREIGN KEY (`jadwalPertemuan_id`) REFERENCES `jadwal_pertemuans`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
