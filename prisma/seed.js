import { PrismaClient } from "@prisma/client";
import { jurusans, prodis, tahunAjarans, kelas } from "./data.js";

const prisma = new PrismaClient();

const load = async () => {
  try {
    // delete
    await prisma.kelas.deleteMany();
    console.log("Deleted records in kelas table");

    await prisma.tahunAjaran.deleteMany();
    console.log("Deleted records in tahun_ajarans table");

    await prisma.prodi.deleteMany();
    console.log("Deleted records in prodis table");

    await prisma.jurusan.deleteMany();
    console.log("Deleted records in jurusans table");

    // truncate
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
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
