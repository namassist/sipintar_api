import { prismaClient } from "../apps/database.js";
import { validate } from "../validations/validation.js";
import { ResponseError } from "../errors/response-error.js";
import {
  getRekapitulasiValidation,
  searchRekapitulasiValidation,
  searchRekapitulasiMengajarValidation,
} from "../validations/rekapitulasi-validation.js";

const checkDosenMustExists = async (dosenId) => {
  dosenId = validate(getRekapitulasiValidation, dosenId);

  const totalDosentInDatabase = await prismaClient.dosen.count({
    where: {
      id: dosenId,
    },
  });

  if (totalDosentInDatabase !== 1) {
    throw new ResponseError(404, "dosen is not found");
  }

  return dosenId;
};

const list = async (mahasiswaId) => {
  mahasiswaId = validate(getRekapitulasiValidation, mahasiswaId);

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
  dosenId = validate(getRekapitulasiValidation, dosenId);

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
    rekapitulasi: dosen.kelasMataKuliahDosen.map((data) => {
      const kelas = data.kelas.nama_kelas;
      const mataKuliah = data.mataKuliah.nama_mk;

      const total_jam =
        data.jadwal.reduce((total, jadwal) => total + jadwal.total_jam, 0) * 16;

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
            total_hadir: presensiCount.Hadir,
            total_izin: presensiCount.Izin,
            total_sakit: presensiCount.Sakit,
            total_alpha: presensiCount.Alpha,
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
  };

  return result;
};

const listPresensiMahasiswa = async (request, dosenId) => {
  dosenId = await checkDosenMustExists(dosenId);
  request = validate(searchRekapitulasiValidation, request);

  // 1 ((page - 1) * size) = 0
  // 2 ((page - 1) * size) = 10
  const skip = (request.page - 1) * request.size;

  const filters = [];

  if (request.kelas_id) {
    filters.push({
      OR: [
        {
          kelas_id: {
            equals: parseInt(request.kelas_id),
          },
        },
      ],
    });
  }

  const mahasiswa = await prismaClient.mahasiswa.findMany({
    where: {
      AND: filters,
    },
    take: request.size,
    skip: skip,
    select: {
      id: true,
      nama_mahasiswa: true,
      nim: true,
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
  });

  if (mahasiswa.length === 0) {
    throw new ResponseError(404, "Mahasiswa is not found");
  }

  const totalItems = await prismaClient.mahasiswa.count({
    where: {
      AND: filters,
    },
  });

  const formattedMahasiswa = mahasiswa.map((mhs) => {
    const rekapitulasi = mhs.presensiMahasiswa.reduce(
      (totals, presensi) => {
        if (presensi.status_presensi === "Hadir") {
          totals.total_hadir += presensi.jadwalPertemuan.total_jam;
        } else if (presensi.status_presensi === "Sakit") {
          totals.total_sakit += presensi.jadwalPertemuan.total_jam;
        } else if (presensi.status_presensi === "Izin") {
          totals.total_izin += presensi.jadwalPertemuan.total_jam;
        } else if (presensi.status_presensi === "Alpha") {
          totals.total_alpha += presensi.jadwalPertemuan.total_jam;
        }
        return totals;
      },
      {
        total_hadir: 0,
        total_sakit: 0,
        total_izin: 0,
        total_alpha: 0,
      }
    );

    return {
      id: mhs.id,
      nama_mahasiswa: mhs.nama_mahasiswa,
      nim: mhs.nim,
      rekapitulasi,
    };
  });

  return {
    data: formattedMahasiswa,
    paging: {
      page: request.page,
      total_item: totalItems,
      total_page: Math.ceil(totalItems / request.size),
    },
  };
};

const listRekapitulasiMengajar = async (request, dosenId) => {
  dosenId = await checkDosenMustExists(dosenId);

  request = validate(searchRekapitulasiMengajarValidation, request);

  // 1 ((page - 1) * size) = 0
  // 2 ((page - 1) * size) = 10
  const skip = (request.page - 1) * request.size;

  const whereClause = {
    kelasMataKuliahDosen: {
      dosen_id: dosenId,
    },
  };

  if (request.bulan) {
    whereClause.waktu_realisasi = {
      gte: new Date(`2023-${request.bulan}-01`).toISOString(),
      lt: new Date(`2023-${Number(request.bulan) + 1}-01`).toISOString(),
    };
  }

  const jadwalPertemuan = await prismaClient.jadwalPertemuan.findMany({
    where: whereClause,
    take: request.size,
    skip: skip,
    select: {
      id: true,
      hari: true,
      waktu_realisasi: true,
      total_jam: true,
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
        },
      },
    },
  });

  const totalItems = await prismaClient.jadwalPertemuan.count({
    where: {
      AND: [
        {
          waktu_realisasi: {
            gte: new Date("2023-01-01").toISOString(),
            lt: new Date("2023-02-01").toISOString(),
          },
        },
        {
          kelasMataKuliahDosen: {
            dosen_id: dosenId,
          },
        },
      ],
    },
  });

  const results = jadwalPertemuan.map((item) => ({
    id: item.id,
    mataKuliah: item.kelasMataKuliahDosen.mataKuliah.nama_mk,
    kelas: item.kelasMataKuliahDosen.kelas.nama_kelas,
    waktu_realisasi: item.waktu_realisasi,
    total_jam: item.total_jam,
  }));

  return {
    data: results,
    paging: {
      page: request.page,
      total_item: totalItems,
      total_page: Math.ceil(totalItems / request.size),
    },
  };
};

export default {
  list,
  listPresensi,
  listPresensiMahasiswa,
  listRekapitulasiMengajar,
};
