import { PrismaClient } from "@prisma/client";
import {
  jurusans,
  prodis,
  tahunAjarans,
  kelas,
  users,
  mahasiswas,
  dosens,
  admins,
  mataKuliahs,
  kelasMataKuliahs,
} from "./data.js";

const prisma = new PrismaClient();

const load = async () => {
  try {
    // delete
    await prisma.kelasMataKuliah.deleteMany();
    console.log("Deleted records in kelas_mata_kuliahs table");

    await prisma.mataKuliah.deleteMany();
    console.log("Deleted records in mata_kuliahs table");

    await prisma.dosen.deleteMany();
    console.log("Deleted records in dosens table");

    await prisma.admin.deleteMany();
    console.log("Deleted records in admins table");

    await prisma.mahasiswa.deleteMany();
    console.log("Deleted records in mahasiswas table");

    await prisma.user.deleteMany();
    console.log("Deleted records in users table");

    await prisma.kelas.deleteMany();
    console.log("Deleted records in kelas table");

    await prisma.tahunAjaran.deleteMany();
    console.log("Deleted records in tahun_ajarans table");

    await prisma.prodi.deleteMany();
    console.log("Deleted records in prodis table");

    await prisma.jurusan.deleteMany();
    console.log("Deleted records in jurusans table");

    // truncate
    await prisma.$queryRaw`ALTER TABLE kelas_mata_kuliahs AUTO_INCREMENT = 1`;
    console.log("reset KelasMataKuliahs auto increment to 1");

    await prisma.$queryRaw`ALTER TABLE mata_kuliahs AUTO_INCREMENT = 1`;
    console.log("reset mata_kuliahs auto increment to 1");

    await prisma.$queryRaw`ALTER TABLE dosens AUTO_INCREMENT = 1`;
    console.log("reset dosens auto increment to 1");

    await prisma.$queryRaw`ALTER TABLE admins AUTO_INCREMENT = 1`;
    console.log("reset admins auto increment to 1");

    await prisma.$queryRaw`ALTER TABLE mahasiswas AUTO_INCREMENT = 1`;
    console.log("reset mahasiswas auto increment to 1");

    await prisma.$queryRaw`ALTER TABLE users AUTO_INCREMENT = 1`;
    console.log("reset users auto increment to 1");

    await prisma.$queryRaw`ALTER TABLE kelas AUTO_INCREMENT = 1`;
    console.log("reset kelas auto increment to 1");

    await prisma.$queryRaw`ALTER TABLE tahun_ajarans AUTO_INCREMENT = 1`;
    console.log("reset tahun_ajaran auto increment to 1");

    await prisma.$queryRaw`ALTER TABLE prodis AUTO_INCREMENT = 1`;
    console.log("reset prodis auto increment to 1");

    await prisma.$queryRaw`ALTER TABLE jurusans AUTO_INCREMENT = 1`;
    console.log("reset jurusans auto increment to 1");

    // create
    await prisma.jurusan.createMany({
      data: jurusans,
    });
    console.log("Added jurusans data");

    await prisma.prodi.createMany({
      data: prodis,
    });
    console.log("Added prodis data");

    await prisma.tahunAjaran.createMany({
      data: tahunAjarans,
    });
    console.log("Added tahun_ajarans data");

    await prisma.kelas.createMany({
      data: kelas,
    });
    console.log("Added kelas data");

    await prisma.user.createMany({
      data: users,
    });
    console.log("Added users data");

    await prisma.mahasiswa.createMany({
      data: mahasiswas,
    });
    console.log("Added mahasiswas data");

    await prisma.dosen.createMany({
      data: dosens,
    });
    console.log("Added dosens data");

    await prisma.admin.createMany({
      data: admins,
    });
    console.log("Added admins data");

    await prisma.mataKuliah.createMany({
      data: mataKuliahs,
    });
    console.log("Added mataKuliahs data");

    await prisma.kelasMataKuliah.createMany({
      data: kelasMataKuliahs,
    });
    console.log("Added kelas_mata_kuliahs data");
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
