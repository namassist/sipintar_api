import { prismaClient } from "../apps/database.js";
import { validate } from "../validations/validation.js";
import { ResponseError } from "../errors/response-error.js";
import {
  createJadwalValidation,
  getJadwalValidation,
  searchJadwalValidation,
  updateJadwalValidation,
} from "../validations/jadwal-validation.js";

const create = async (requests) => {
  const jadwals = requests.map((request) =>
    validate(createJadwalValidation, request)
  );

  const createdJadwals = await prismaClient.jadwal.createMany({
    data: jadwals.map((jadwal) => ({
      hari: jadwal.hari,
      jam_mulai: jadwal.jam_mulai,
      jam_akhir: jadwal.jam_akhir,
      ruangan: jadwal.ruangan,
      kelas_id: jadwal.kelas_id,
      tahun_ajaran_id: jadwal.tahun_ajaran_id,
      mata_kuliah_id: jadwal.mata_kuliah_id,
      dosen_id: jadwal.dosen_id,
    })),
  });

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
      kelas: {
        select: {
          nama_kelas: true,
        },
      },
      tahunAjaran: {
        select: {
          nama: true,
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
    kelas: jadwal.kelas.nama_kelas,
    tahunAjaran: jadwal.tahunAjaran.nama,
    mataKuliah: jadwal.mataKuliah.nama_mk,
    kode_mk: jadwal.mataKuliah.kode_mk,
    dosen: jadwal.dosen.nama_dosen,
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

  const updatedJadwal = await prismaClient.jadwal.update({
    where: {
      id: jadwal.id,
    },
    data: {
      hari: jadwal.hari,
      jam_mulai: jadwal.jam_mulai,
      jam_akhir: jadwal.jam_akhir,
      ruangan: jadwal.ruangan,
      kelas_id: jadwal.kelas_id,
      tahun_ajaran_id: jadwal.tahun_ajaran_id,
      mata_kuliah_id: jadwal.mata_kuliah_id,
      dosen_id: jadwal.dosen_id,
    },
    select: {
      id: true,
      hari: true,
      jam_mulai: true,
      jam_akhir: true,
      ruangan: true,
      kelas: {
        select: {
          nama_kelas: true,
        },
      },
      tahunAjaran: {
        select: {
          nama: true,
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
  });

  return {
    id: updatedJadwal.id,
    hari: updatedJadwal.hari,
    jam_mulai: updatedJadwal.jam_mulai,
    jam_akhir: updatedJadwal.jam_akhir,
    ruangan: updatedJadwal.ruangan,
    kelas: updatedJadwal.kelas.nama_kelas,
    tahunAjaran: updatedJadwal.tahunAjaran.nama,
    mataKuliah: updatedJadwal.mataKuliah.nama_mk,
    kode_mk: updatedJadwal.mataKuliah.kode_mk,
    dosen: updatedJadwal.dosen.nama_dosen,
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

  return await prismaClient.jadwal.delete({
    where: { id: jadwalId },
  });
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
            equals: parseInt(request.tahun_ajaran_id),
          },
        },
      ],
    });
  }

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
      kelas: {
        select: {
          nama_kelas: true,
        },
      },
      tahunAjaran: {
        select: {
          nama: true,
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
    kelas: item.kelas.nama_kelas,
    tahunAjaran: item.tahunAjaran.nama,
    mataKuliah: item.mataKuliah.nama_mk,
    kode_mk: item.mataKuliah.kode_mk,
    dosen: item.dosen.nama_dosen,
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

export default {
  get,
  create,
  update,
  remove,
  search,
};
