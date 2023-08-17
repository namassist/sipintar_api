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

const list = async (mahasiswaId) => {
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
              jadwalPertemuan: {
                select: {
                  waktu_realisasi: true,
                  jam_mulai: true,
                  jam_akhir: true,
                  total_jam: true,
                  topik_perkuliahan: true,
                  presensiMahasiswa: {
                    select: {
                      status_presensi: true,
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
    rekapitulasi: mahasiswa.kelas.kelasMataKuliahDosen.map((data) => {
      const mataKuliah = data.mataKuliah.nama_mk;
      const total_jam =
        data.jadwal.reduce((total, jadwal) => total + jadwal.total_jam, 0) * 16;
      const total_hadir = data.jadwalPertemuan.reduce((total, jadwal) => {
        if (jadwal.presensiMahasiswa[0].status_presensi === "Hadir") {
          return total + jadwal.total_jam;
        }
        return total;
      }, 0);
      const total_sakit = data.jadwalPertemuan.reduce((total, jadwal) => {
        if (jadwal.presensiMahasiswa[0].status_presensi === "Sakit") {
          return total + jadwal.total_jam;
        }
        return total;
      }, 0);
      const total_izin = data.jadwalPertemuan.reduce((total, jadwal) => {
        if (jadwal.presensiMahasiswa[0].status_presensi === "Izin") {
          return total + jadwal.total_jam;
        }
        return total;
      }, 0);
      const total_alpha = total_jam - (total_hadir + total_izin + total_sakit);

      const jadwalPertemuan = data.jadwalPertemuan.map((jadwal) => ({
        waktu_realisasi: jadwal.waktu_realisasi,
        jam_mulai: jadwal.jam_mulai,
        jam_akhir: jadwal.jam_akhir,
        total_jam: jadwal.total_jam,
        topik_perkuliahan: jadwal.topik_perkuliahan,
        status_presensi: jadwal.presensiMahasiswa[0].status_presensi,
      }));

      return {
        mataKuliah,
        total_jam,
        total_hadir,
        total_izin,
        total_sakit,
        total_alpha,
        jadwalPertemuan,
      };
    }),
  };

  return result;
};

export default {
  create,
  list,
};
