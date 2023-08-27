import { prismaClient } from "../apps/database.js";
import { validate } from "../validations/validation.js";
import { ResponseError } from "../errors/response-error.js";
import { getMahasiswaValidation } from "../validations/mahasiswa-validation.js";
import {
  createJadwalValidation,
  getJadwalValidation,
  searchJadwalValidation,
  updateJadwalValidation,
} from "../validations/jadwal-validation.js";
import {
  getDosenValidation,
  searchJadwalDosenValidation,
} from "../validations/dosen-validation.js";

const checkDosenMustExists = async (dosenId) => {
  dosenId = validate(getDosenValidation, dosenId);

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

const checkMahasiswaMustExists = async (mahasiswaId) => {
  mahasiswaId = validate(getMahasiswaValidation, mahasiswaId);

  const totalMahasiswaInDatabase = await prismaClient.mahasiswa.count({
    where: {
      id: mahasiswaId,
    },
  });

  if (totalMahasiswaInDatabase !== 1) {
    throw new ResponseError(404, "mahasiswa is not found");
  }

  return mahasiswaId;
};

const create = async (requests) => {
  const createdJadwals = [];

  for (const request of requests) {
    const validatedRequest = validate(createJadwalValidation, request);

    const existingRelation = await prismaClient.kelasMataKuliahDosen.findFirst({
      where: {
        kelas_id: validatedRequest.kelas_id,
        mata_kuliah_id: validatedRequest.mata_kuliah_id,
        dosen_id: validatedRequest.dosen_id,
      },
    });

    let pivotId;

    if (!existingRelation) {
      const createdPivot = await prismaClient.kelasMataKuliahDosen.create({
        data: {
          kelas_id: validatedRequest.kelas_id,
          mata_kuliah_id: validatedRequest.mata_kuliah_id,
          dosen_id: validatedRequest.dosen_id,
        },
        select: {
          kelas_mk_dosen_id: true,
        },
      });
      pivotId = createdPivot.kelas_mk_dosen_id;
    } else {
      pivotId = existingRelation.kelas_mk_dosen_id;
    }

    const createdJadwal = await prismaClient.jadwal.create({
      data: {
        hari: validatedRequest.hari,
        jam_mulai: validatedRequest.jam_mulai,
        jam_akhir: validatedRequest.jam_akhir,
        ruangan: validatedRequest.ruangan,
        total_jam: validatedRequest.total_jam,
        kelas_mk_dosen_id: pivotId,
        tahun_ajaran_id: validatedRequest.tahun_ajaran_id,
      },
    });

    createdJadwals.push(createdJadwal);
  }

  return createdJadwals;
};

const get = async (jadwalId) => {
  jadwalId = validate(getJadwalValidation, jadwalId);

  const jadwal = await prismaClient.jadwal.findFirst({
    where: {
      id: jadwalId,
    },
    select: {
      id: true,
      hari: true,
      jam_mulai: true,
      jam_akhir: true,
      ruangan: true,
      total_jam: true,
      tahunAjaran: {
        select: {
          nama: true,
        },
      },
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
              kode_mk: true,
            },
          },
          dosen: {
            select: {
              nama_dosen: true,
            },
          },
        },
      },
    },
  });

  if (!jadwal) {
    throw new ResponseError(404, "Jadwal is not found");
  }

  return {
    id: jadwal.id,
    hari: jadwal.hari,
    jam_mulai: jadwal.jam_mulai,
    jam_akhir: jadwal.jam_akhir,
    ruangan: jadwal.ruangan,
    total_jam: jadwal.total_jam,
    tahunAjaran: jadwal.tahunAjaran.nama,
    kelas: jadwal.kelasMataKuliahDosen.kelas.nama_kelas,
    mataKuliah: jadwal.kelasMataKuliahDosen.mataKuliah.nama_mk,
    kode_mk: jadwal.kelasMataKuliahDosen.mataKuliah.kode_mk,
    dosen: jadwal.kelasMataKuliahDosen.dosen.nama_dosen,
  };
};

const update = async (request) => {
  const jadwal = validate(updateJadwalValidation, request);

  const totalJadwalInDatabase = await prismaClient.jadwal.count({
    where: {
      id: jadwal.id,
    },
  });

  if (totalJadwalInDatabase !== 1) {
    throw new ResponseError(404, "Jadwal is not found");
  }

  const currentJadwal = await prismaClient.jadwal.findFirst({
    where: {
      id: jadwal.id,
    },
    select: {
      kelas_mk_dosen_id: true,
    },
  });

  const updatedPivot = await prismaClient.kelasMataKuliahDosen.update({
    where: {
      kelas_mk_dosen_id: currentJadwal.kelas_mk_dosen_id,
    },
    data: {
      dosen_id: jadwal.dosen_id,
      mata_kuliah_id: jadwal.mata_kuliah_id,
      kelas_id: jadwal.kelas_id,
    },
    select: {
      kelas_mk_dosen_id: true,
    },
  });

  const updatedJadwal = await prismaClient.jadwal.update({
    where: {
      id: jadwal.id,
    },
    data: {
      hari: jadwal.hari,
      jam_mulai: jadwal.jam_mulai,
      jam_akhir: jadwal.jam_akhir,
      ruangan: jadwal.ruangan,
      total_jam: jadwal.total_jam,
      tahun_ajaran_id: jadwal.tahun_ajaran_id,
      kelas_mk_dosen_id: updatedPivot.kelas_mk_dosen_id,
    },
    select: {
      id: true,
      hari: true,
      jam_mulai: true,
      jam_akhir: true,
      ruangan: true,
      total_jam: true,
      tahunAjaran: {
        select: {
          nama: true,
        },
      },
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
              kode_mk: true,
            },
          },
          dosen: {
            select: {
              nama_dosen: true,
            },
          },
        },
      },
    },
  });

  return {
    id: updatedJadwal.id,
    hari: updatedJadwal.hari,
    jam_mulai: updatedJadwal.jam_mulai,
    jam_akhir: updatedJadwal.jam_akhir,
    ruangan: updatedJadwal.ruangan,
    total_jam: updatedJadwal.total_jam,
    tahunAjaran: updatedJadwal.tahunAjaran.nama,
    kelas: updatedJadwal.kelasMataKuliahDosen.kelas.nama_kelas,
    mataKuliah: updatedJadwal.kelasMataKuliahDosen.mataKuliah.nama_mk,
    kode_mk: updatedJadwal.kelasMataKuliahDosen.mataKuliah.kode_mk,
    dosen: updatedJadwal.kelasMataKuliahDosen.dosen.nama_dosen,
  };
};

const remove = async (jadwalId) => {
  jadwalId = validate(getJadwalValidation, jadwalId);

  const totalInDatabase = await prismaClient.jadwal.count({
    where: {
      id: jadwalId,
    },
  });

  if (totalInDatabase !== 1) {
    throw new ResponseError(404, "Jadwal is not found");
  }

  const findId = await prismaClient.jadwal.findFirst({
    where: { id: jadwalId },
    select: {
      kelas_mk_dosen_id: true,
    },
  });

  const isMultiple = await prismaClient.jadwal.count({
    where: { kelas_mk_dosen_id: findId.kelas_mk_dosen_id },
  });

  const deletedJadwal = await prismaClient.jadwal.delete({
    where: {
      id: jadwalId,
    },
  });

  if (isMultiple === 1) {
    await prismaClient.kelasMataKuliahDosen.delete({
      where: {
        kelas_mk_dosen_id: findId.kelas_mk_dosen_id,
      },
    });
  }

  return deletedJadwal;
};

const search = async (request) => {
  request = validate(searchJadwalValidation, request);

  // 1 ((page - 1) * size) = 0
  // 2 ((page - 1) * size) = 10
  const skip = (request.page - 1) * request.size;

  const filters = [];

  if (request.tahun_ajaran_id) {
    filters.push({
      OR: [
        {
          tahun_ajaran_id: {
            equals: request.tahun_ajaran_id,
          },
        },
      ],
    });
  }

  if (request.kelas_id) {
    filters.push({
      OR: [
        {
          kelasMataKuliahDosen: {
            kelas_id: {
              equals: request.kelas_id,
            },
          },
        },
      ],
    });
  }

  const jadwal = await prismaClient.jadwal.findMany({
    where: {
      AND: filters,
    },
    take: request.size,
    skip: skip,
    select: {
      id: true,
      hari: true,
      jam_mulai: true,
      jam_akhir: true,
      ruangan: true,
      total_jam: true,
      tahunAjaran: {
        select: {
          nama: true,
        },
      },
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
              kode_mk: true,
            },
          },
          dosen: {
            select: {
              nama_dosen: true,
            },
          },
        },
      },
    },
  });

  if (jadwal.length === 0) {
    throw new ResponseError(404, "Jadwal is not found");
  }

  const totalItems = await prismaClient.jadwal.count({
    where: {
      AND: filters,
    },
  });

  const formattedJadwal = jadwal.map((item) => ({
    id: item.id,
    hari: item.hari,
    jam_mulai: item.jam_mulai,
    jam_akhir: item.jam_akhir,
    ruangan: item.ruangan,
    total_jam: item.total_jam,
    kelas: item.kelasMataKuliahDosen.kelas.nama_kelas,
    tahunAjaran: item.tahunAjaran.nama,
    nama_mk: item.kelasMataKuliahDosen.mataKuliah.nama_mk,
    kode_mk: item.kelasMataKuliahDosen.mataKuliah.kode_mk,
    dosen: item.kelasMataKuliahDosen.dosen.nama_dosen,
  }));

  return {
    data: formattedJadwal,
    paging: {
      page: request.page,
      total_item: totalItems,
      total_page: Math.ceil(totalItems / request.size),
    },
  };
};

const jadwalDosen = async (dosenId, request) => {
  dosenId = await checkDosenMustExists(dosenId);
  request = validate(searchJadwalDosenValidation, request);

  // 1 ((page - 1) * size) = 0
  // 2 ((page - 1) * size) = 10
  const skip = (request.page - 1) * request.size;

  const filters = [];

  if (request.hari) {
    filters.push({
      OR: [
        {
          hari: {
            contains: request.hari,
          },
        },
      ],
    });
  }

  const dosen = await prismaClient.jadwal.findMany({
    where: {
      AND: filters,
      kelasMataKuliahDosen: {
        dosen_id: dosenId,
      },
    },
    take: request.size,
    skip: skip,
    select: {
      id: true,
      hari: true,
      jam_mulai: true,
      jam_akhir: true,
      ruangan: true,
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
              kode_mk: true,
            },
          },
        },
      },
    },
  });

  if (dosen.length === 0) {
    throw new ResponseError(404, "Tidak ada Jadwal Hari ini");
  }

  const totalItems = await prismaClient.jadwal.count({
    where: {
      AND: filters,
    },
  });

  const results = dosen.map((item) => ({
    id: item.id,
    hari: item.hari,
    jam_mulai: item.jam_mulai,
    jam_akhir: item.jam_akhir,
    ruangan: item.ruangan,
    total_jam: item.total_jam,
    kelas: item.kelasMataKuliahDosen.kelas.nama_kelas,
    nama_mk: item.kelasMataKuliahDosen.mataKuliah.nama_mk,
    kode_mk: item.kelasMataKuliahDosen.mataKuliah.kode_mk,
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

const jadwalMahasiswa = async (mahasiswaId) => {
  mahasiswaId = await checkMahasiswaMustExists(mahasiswaId);

  const kelas = await prismaClient.mahasiswa.findUnique({
    where: {
      id: mahasiswaId,
    },
    select: {
      kelas_id: true,
    },
  });

  const jadwals = await prismaClient.jadwal.findMany({
    where: {
      kelasMataKuliahDosen: {
        kelas_id: kelas.kelas_id,
      },
    },
    select: {
      id: true,
      hari: true,
      jam_mulai: true,
      jam_akhir: true,
      ruangan: true,
      total_jam: true,
      kelas_mk_dosen_id: true,
      kelasMataKuliahDosen: {
        select: {
          dosen: {
            select: {
              nama_dosen: true,
            },
          },
          kelas: {
            select: {
              nama_kelas: true,
            },
          },
          mataKuliah: {
            select: {
              nama_mk: true,
              kode_mk: true,
            },
          },
        },
      },
    },
  });

  if (jadwals.length === 0) {
    throw new ResponseError(404, "tidak ada jadwal untuk kelas ini");
  }

  const results = jadwals.map((item) => ({
    id: item.id,
    hari: item.hari,
    jam_mulai: item.jam_mulai,
    jam_akhir: item.jam_akhir,
    ruangan: item.ruangan,
    total_jam: item.total_jam,
    total_jam: item.total_jam,
    kelas_mk_dosen_id: item.kelas_mk_dosen_id,
    dosen: item.kelasMataKuliahDosen.dosen.nama_dosen,
    nama_mk: item.kelasMataKuliahDosen.mataKuliah.nama_mk,
    kode_mk: item.kelasMataKuliahDosen.mataKuliah.kode_mk,
  }));

  return results;
};

export default {
  get,
  create,
  update,
  remove,
  search,
  jadwalDosen,
  jadwalMahasiswa,
};
