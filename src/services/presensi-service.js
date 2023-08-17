import { prismaClient } from "../apps/database.js";
import { validate } from "../validations/validation.js";
import { ResponseError } from "../errors/response-error.js";
import {
  createPresensiValidation,
  getPresensiValidation,
} from "../validations/presensi-validation.js";

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

  const isAvailable = await prismaClient.jadwalPertemuan.findFirst({
    where: {
      kelasMataKuliahDosen: {
        kelas_id: mahasiswa.kelas_id,
      },
      qr_code: presensi.qr_code,
    },
    select: {
      id: true,
      kelas_mk_dosen_id: true,
    },
  });

  if (isAvailable.id === undefined) {
    throw new ResponseError(404, "presensi tidak valid");
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

export default {
  create,
  get,
};
