import { prismaClient } from "../apps/database.js";
import { validate } from "../validations/validation.js";
import { ResponseError } from "../errors/response-error.js";
import {
  createKelasValidation,
  getKelasValidation,
  searchKelasValidation,
  updateKelasValidation,
} from "../validations/kelas-validation.js";

const create = async (request) => {
  const kelas = validate(createKelasValidation, request);

  const countKelas = await prismaClient.kelas.count({
    where: {
      nama_kelas: kelas.nama_kelas,
    },
  });

  if (countKelas === 1) {
    throw new ResponseError(400, "Kelas already exists");
  }

  const createdKelas = await prismaClient.kelas.create({
    data: {
      nama_kelas: kelas.nama_kelas,
      tahun_ajaran_id: kelas.tahun_ajaran_id,
      prodi_id: kelas.prodi_id,
    },
    select: {
      id: true,
      nama_kelas: true,
      tahunAjaran: {
        select: {
          nama: true,
        },
      },
      prodi: {
        select: {
          nama_prodi: true,
        },
      },
    },
  });

  return {
    id: createdKelas.id,
    nama_kelas: createdKelas.nama_kelas,
    tahunAjaran: createdKelas.tahunAjaran.nama,
    prodi: createdKelas.prodi.nama_prodi,
  };
};

const get = async (kelasId) => {
  kelasId = validate(getKelasValidation, kelasId);

  const kelas = await prismaClient.kelas.findFirst({
    where: {
      id: kelasId,
    },
    select: {
      id: true,
      nama_kelas: true,
      tahunAjaran: {
        select: {
          nama: true,
        },
      },
      prodi: {
        select: {
          nama_prodi: true,
          jurusan: {
            select: {
              nama_jurusan: true,
            },
          },
        },
      },
    },
  });

  if (!kelas) {
    throw new ResponseError(404, "Kelas is not found");
  }

  return {
    id: kelas.id,
    nama_kelas: kelas.nama_kelas,
    prodi: kelas.prodi.nama_prodi,
    jurusan: kelas.prodi.jurusan.nama_jurusan,
    tahunAjaran: kelas.tahunAjaran.nama,
  };
};

const update = async (request) => {
  const kelas = validate(updateKelasValidation, request);

  const totalKelasInDatabase = await prismaClient.kelas.count({
    where: {
      id: kelas.id,
    },
  });

  if (totalKelasInDatabase !== 1) {
    throw new ResponseError(404, "Kelas is not found");
  }

  const updatedKelas = await prismaClient.kelas.update({
    where: {
      id: kelas.id,
    },
    data: {
      nama_kelas: kelas.nama_kelas,
      tahun_ajaran_id: kelas.tahun_ajaran_id,
      prodi_id: kelas.prodi_id,
    },
    select: {
      id: true,
      nama_kelas: true,
      tahunAjaran: {
        select: {
          nama: true,
        },
      },
      prodi: {
        select: {
          nama_prodi: true,
        },
      },
    },
  });

  return {
    id: updatedKelas.id,
    nama_kelas: updatedKelas.nama_kelas,
    tahunAjaran: updatedKelas.tahunAjaran.nama,
    prodi: updatedKelas.prodi.nama_prodi,
  };
};

const remove = async (kelasId) => {
  kelasId = validate(getKelasValidation, kelasId);

  const totalInDatabase = await prismaClient.kelas.count({
    where: {
      id: kelasId,
    },
  });

  if (totalInDatabase !== 1) {
    throw new ResponseError(404, "Kelas is not found");
  }

  return await prismaClient.kelas.delete({
    where: { id: kelasId },
  });
};

const search = async (request) => {
  request = validate(searchKelasValidation, request);

  // 1 ((page - 1) * size) = 0
  // 2 ((page - 1) * size) = 10
  const skip = (request.page - 1) * request.size;

  const filters = [];

  if (request.nama) {
    filters.push({
      OR: [
        {
          nama_kelas: {
            contains: request.nama,
          },
        },
      ],
    });
  }

  if (request.prodi_id) {
    filters.push({
      OR: [
        {
          prodi_id: {
            equals: parseInt(request.prodi_id),
          },
        },
      ],
    });
  }

  const kelas = await prismaClient.kelas.findMany({
    where: {
      AND: filters,
    },
    take: request.size,
    skip: skip,
    select: {
      id: true,
      nama_kelas: true,
      tahunAjaran: {
        select: {
          nama: true,
        },
      },
      prodi: {
        select: {
          nama_prodi: true,
          jurusan: {
            select: {
              nama_jurusan: true,
            },
          },
        },
      },
    },
  });

  if (kelas.length === 0) {
    throw new ResponseError(404, "Kelas is not found");
  }

  const totalItems = await prismaClient.kelas.count({
    where: {
      AND: filters,
    },
  });

  const formattedKelas = kelas.map((item) => ({
    id: item.id,
    nama_kelas: item.nama_kelas,
    tahunAjaran: item.tahunAjaran.nama,
    prodi: item.prodi.nama_prodi,
    jurusan: item.prodi.jurusan.nama_jurusan,
  }));

  return {
    data: formattedKelas,
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
