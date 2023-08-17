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

const get = async (mahasiswaId) => {
  mahasiswaId = validate(getPresensiValidation, mahasiswaId);

  const mahasiswa = await prismaClient.mahasiswa.findUnique({
    where: {
      id: mahasiswaId,
    },
    select: {
      id: true,
      nama_mahasiswa: true,
      kelas: {
        select: {
          kelasMataKuliahDosen: {
            select: {
              mataKuliah: {
                select: {
                  nama_mk: true,
                },
              },
              jadwal: {
                select: {
                  total_jam: true,
                },
              },
              presensiMahasiswa: {
                select: {
                  status_presensi: true,
                  jadwalPertemuan: {
                    select: {
                      total_jam: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const result = {
    id: mahasiswa.id,
    nama_mahasiswa: mahasiswa.nama_mahasiswa,
    rekapitulasi: mahasiswa.kelas.kelasMataKuliahDosen.map((mkData) => {
      const mataKuliah = mkData.mataKuliah.nama_mk;
      const total_jam =
        mkData.jadwal.reduce((total, jadwal) => total + jadwal.total_jam, 0) *
        16;
      const total_hadir = mkData.presensiMahasiswa
        .filter((presensi) => presensi.status_presensi === "Hadir")
        .reduce(
          (total, presensi) => total + presensi.jadwalPertemuan.total_jam,
          0
        );
      const total_izin = mkData.presensiMahasiswa
        .filter((presensi) => presensi.status_presensi === "Izin")
        .reduce(
          (total, presensi) => total + presensi.jadwalPertemuan.total_jam,
          0
        );
      const total_sakit = mkData.presensiMahasiswa
        .filter((presensi) => presensi.status_presensi === "Sakit")
        .reduce(
          (total, presensi) => total + presensi.jadwalPertemuan.total_jam,
          0
        );
      const total_alpha = total_jam - (total_hadir + total_izin + total_sakit);

      return {
        mataKuliah,
        total_jam,
        total_hadir,
        total_izin,
        total_sakit,
        total_alpha,
      };
    }),
  };

  return result;
};

export default {
  create,
  get,
};
