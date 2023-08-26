import { prismaClient } from "../apps/database.js";
import { validate } from "../validations/validation.js";
import { ResponseError } from "../errors/response-error.js";
import {
  createPresensiValidation,
  getPresensiValidation,
} from "../validations/presensi-validation.js";
import pkg from "jsonwebtoken";
const { verify } = pkg;
const secretKey = "rifkasyantik";

const create = async (request) => {
  const presensi = validate(createPresensiValidation, request);

  const mahasiswa = await prismaClient.mahasiswa.findUnique({
    where: {
      id: presensi.mahasiswa_id,
    },
    select: {
      kelas_id: true,
    },
  });

  const data = verify(presensi.token, secretKey);

  const isAvailable = await prismaClient.jadwalPertemuan.findFirst({
    where: {
      kelasMataKuliahDosen: {
        kelas_id: mahasiswa.kelas_id,
      },
      id: data.id,
      hari: data.hari,
      jam_mulai: data.jam_mulai,
      jam_akhir: data.jam_akhir,
      ruangan: data.ruangan,
      total_jam: data.total_jam,
      topik_perkuliahan: data.topik_perkuliahan,
      kelas_mk_dosen_id: data.kelas_mk_dosen_id,
    },
    select: {
      id: true,
      kelas_mk_dosen_id: true,
      status: true,
      waktu_realisasi: true,
    },
  });

  if (!isAvailable) {
    throw new ResponseError(404, "presensi tidak valid");
  }

  if (!isAvailable.status) {
    throw new ResponseError(410, "presensi ditutup");
  }

  const isPresensi = await prismaClient.presensiMahasiswa.count({
    where: {
      jadwalPertemuan_id: isAvailable.id,
      mahasiswa_id: presensi.mahasiswa_id,
    },
  });

  if (isPresensi === 1) {
    throw new ResponseError(404, "kamu sudah presensi");
  }

  const createdPresensi = await prismaClient.presensiMahasiswa.create({
    data: {
      jadwalPertemuan_id: isAvailable.id,
      mahasiswa_id: presensi.mahasiswa_id,
      waktu_presensi: presensi.waktu_presensi,
      kelas_mk_dosen_id: isAvailable.kelas_mk_dosen_id,
      status_presensi: "Hadir",
    },
    select: {
      id: true,
      waktu_presensi: true,
      status_presensi: true,
    },
  });

  return {
    id: createdPresensi.id,
    waktu: createdPresensi.waktu_presensi,
    status: createdPresensi.status_presensi,
  };
};

const get = async (aktivasiId) => {
  aktivasiId = validate(getPresensiValidation, aktivasiId);

  const presensi = await prismaClient.presensiMahasiswa.findMany({
    where: {
      jadwalPertemuan_id: aktivasiId,
    },
    select: {
      id: true,
      waktu_presensi: true,
      mahasiswa: {
        select: {
          nama_mahasiswa: true,
          nim: true,
        },
      },
    },
  });

  const result = presensi.map((item) => ({
    id: item.id,
    nama_mahasiswa: item.mahasiswa.nama_mahasiswa,
    nim: item.mahasiswa.nim,
    waktu_presensi: item.waktu_presensi,
  }));

  return result;
};

const remove = async (presensiId) => {
  presensiId = validate(getPresensiValidation, presensiId);

  const totalInDatabase = await prismaClient.presensiMahasiswa.count({
    where: {
      id: presensiId,
    },
  });

  if (totalInDatabase !== 1) {
    throw new ResponseError(404, "Presensi is not found");
  }

  return prismaClient.presensiMahasiswa.delete({
    where: { id: presensiId },
  });
};

export default {
  create,
  get,
  remove,
};
