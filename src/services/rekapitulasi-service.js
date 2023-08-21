import { prismaClient } from "../apps/database.js";
import { validate } from "../validations/validation.js";
import { ResponseError } from "../errors/response-error.js";
import { getPresensiValidation } from "../validations/presensi-validation.js";

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
              dosen: {
                select: {
                  nama_dosen: true,
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

  if (!mahasiswa) {
    throw new ResponseError(404, "Mahasiswa not found");
  }

  const result = {
    id: mahasiswa.id,
    nama_mahasiswa: mahasiswa.nama_mahasiswa,
    rekapitulasi: mahasiswa.kelas.kelasMataKuliahDosen.map((data) => {
      const mataKuliah = data.mataKuliah.nama_mk;
      const dosen = data.dosen.nama_dosen;
      const total_jam =
        data.jadwal.reduce((total, jadwal) => total + jadwal.total_jam, 0) * 16;
      const total_hadir = data.jadwalPertemuan.reduce((total, jadwal) => {
        if (jadwal.presensiMahasiswa[0]?.status_presensi === "Hadir") {
          return total + jadwal.total_jam;
        }
        return total;
      }, 0);
      const total_sakit = data.jadwalPertemuan.reduce((total, jadwal) => {
        if (jadwal.presensiMahasiswa[0]?.status_presensi === "Sakit") {
          return total + jadwal.total_jam;
        }
        return total;
      }, 0);
      const total_izin = data.jadwalPertemuan.reduce((total, jadwal) => {
        if (jadwal.presensiMahasiswa[0]?.status_presensi === "Izin") {
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
        status_presensi: jadwal.presensiMahasiswa[0]?.status_presensi,
      }));

      return {
        mataKuliah,
        dosen,
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
const listPresensi = async (dosenId) => {
  dosenId = validate(getPresensiValidation, dosenId);

  const dosen = await prismaClient.dosen.findUnique({
    where: {
      id: dosenId,
    },
    select: {
      id: true,
      nama_dosen: true,
      kelasMataKuliahDosen: {
        select: {
          kelas: {
            select: {
              nama_kelas: true,
            },
          },
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
  });

  if (!dosen) {
    throw new ResponseError(404, "Dosen not found");
  }

  const result = {
    data: {
      rekapitulasi: dosen.kelasMataKuliahDosen.map((data) => {
        const kelas = data.kelas.nama_kelas;
        const mataKuliah = data.mataKuliah.nama_mk;

        const total_jam =
          data.jadwal.reduce((total, jadwal) => total + jadwal.total_jam, 0) *
          16;

        const total_hadir = data.jadwalPertemuan.reduce((total, jadwal) => {
          return total + jadwal.total_jam;
        }, 0);

        const total_alpha = total_jam - total_hadir;

        const jadwalPertemuan = data.jadwalPertemuan.map((jadwal) => {
          const presensiCount = jadwal.presensiMahasiswa.reduce(
            (acc, presensi) => {
              acc[presensi.status_presensi] =
                (acc[presensi.status_presensi] || 0) + 1;
              return acc;
            },
            {
              Hadir: 0,
              Izin: 0,
              Sakit: 0,
              Alpha: 0,
            }
          );

          return {
            waktu_realisasi: jadwal.waktu_realisasi,
            jam_mulai: jadwal.jam_mulai,
            jam_akhir: jadwal.jam_akhir,
            total_jam: jadwal.total_jam,
            topik_perkuliahan: jadwal.topik_perkuliahan,
            detail: {
              "total hadir": presensiCount.Hadir,
              "total Izin": presensiCount.Izin,
              "total Sakit": presensiCount.Sakit,
              "total Alpha": presensiCount.Alpha,
            },
          };
        });

        return {
          kelas,
          mataKuliah,
          total_jam,
          total_hadir,
          total_alpha,
          jadwalPertemuan,
        };
      }),
    },
  };

  return result;
};

export default {
  list,
  listPresensi,
};
