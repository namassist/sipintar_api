import { prismaClient } from "../apps/database.js";
import { validate } from "../validations/validation.js";
import { ResponseError } from "../errors/response-error.js";
import {
  createMataKuliahValidation,
  getMataKuliahValidation,
  searchMataKuliahValidation,
  updateMataKuliahValidation,
} from "../validations/mataKuliah-validation.js";

const create = async (request) => {
  const mataKuliah = validate(createMataKuliahValidation, request);

  const countMataKuliah = await prismaClient.mataKuliah.count({
    where: {
      nama_mk: mataKuliah.nama_mk,
      kode_mk: mataKuliah.kode_mk,
    },
  });

  if (countMataKuliah === 1) {
    throw new ResponseError(400, "Mata Kuliah already exists");
  }

  const createdMataKuliah = await prismaClient.mataKuliah.create({
    data: {
      nama_mk: mataKuliah.nama_mk,
      kode_mk: mataKuliah.kode_mk,
      total_jam: mataKuliah.total_jam,
      dosen_id: mataKuliah.dosen_id,
    },
    select: {
      id: true,
      nama_mk: true,
      kode_mk: true,
      total_jam: true,
      dosen: {
        select: {
          nama_dosen: true,
        },
      },
    },
  });

  return {
    id: createdMataKuliah.id,
    nama_mk: createdMataKuliah.nama_mk,
    kode_mk: createdMataKuliah.kode_mk,
    total_jam: createdMataKuliah.total_jam,
    dosen: createdMataKuliah.dosen.nama_dosen,
  };
};

const get = async (mataKuliahId) => {
  mataKuliahId = validate(getMataKuliahValidation, mataKuliahId);

  const mataKuliah = await prismaClient.mataKuliah.findFirst({
    where: {
      id: mataKuliahId,
    },
    select: {
      id: true,
      nama_mk: true,
      kode_mk: true,
      total_jam: true,
      dosen: {
        select: {
          nama_dosen: true,
        },
      },
    },
  });

  if (!mataKuliah) {
    throw new ResponseError(404, "Mata Kuliah is not found");
  }

  return {
    id: mataKuliah.id,
    nama_mk: mataKuliah.nama_mk,
    kode_mk: mataKuliah.kode_mk,
    total_jam: mataKuliah.total_jam,
    dosen: mataKuliah.dosen.nama_dosen,
  };
};

const update = async (request) => {
  const mataKuliah = validate(updateMataKuliahValidation, request);

  const totalMataKuliahInDatabase = await prismaClient.mataKuliah.count({
    where: {
      id: mataKuliah.id,
    },
  });

  if (totalMataKuliahInDatabase !== 1) {
    throw new ResponseError(404, "Mata Kuliah is not found");
  }

  const updatedMataKuliah = await prismaClient.mataKuliah.update({
    where: {
      id: mataKuliah.id,
    },
    data: {
      nama_mk: mataKuliah.nama_mk,
      kode_mk: mataKuliah.kode_mk,
      total_jam: mataKuliah.total_jam,
      dosen_id: mataKuliah.dosen_id,
    },
    select: {
      id: true,
      nama_mk: true,
      kode_mk: true,
      total_jam: true,
      dosen: {
        select: {
          nama_dosen: true,
        },
      },
    },
  });

  return {
    id: updatedMataKuliah.id,
    nama_mk: updatedMataKuliah.nama_mk,
    kode_mk: updatedMataKuliah.kode_mk,
    total_jam: updatedMataKuliah.total_jam,
    dosen: updatedMataKuliah.dosen.nama_dosen,
  };
};

const remove = async (mataKuliahId) => {
  mataKuliahId = validate(getMataKuliahValidation, mataKuliahId);

  const totalInDatabase = await prismaClient.mataKuliah.count({
    where: {
      id: mataKuliahId,
    },
  });

  if (totalInDatabase !== 1) {
    throw new ResponseError(404, "Mata Kuliah is not found");
  }

  return await prismaClient.mataKuliah.delete({
    where: { id: mataKuliahId },
  });
};

const search = async (request) => {
  request = validate(searchMataKuliahValidation, request);

  // 1 ((page - 1) * size) = 0
  // 2 ((page - 1) * size) = 10
  const skip = (request.page - 1) * request.size;

  const filters = [];

  if (request.nama) {
    filters.push({
      OR: [
        {
          nama_mk: {
            contains: request.nama,
          },
        },
      ],
    });
  }

  if (request.kode) {
    filters.push({
      OR: [
        {
          kode_mk: {
            contains: request.kode,
          },
        },
      ],
    });
  }

  if (request.dosen_id) {
    filters.push({
      OR: [
        {
          dosen_id: {
            equals: parseInt(request.dosen_id),
          },
        },
      ],
    });
  }

  const mataKuliah = await prismaClient.mataKuliah.findMany({
    where: {
      AND: filters,
    },
    take: request.size,
    skip: skip,
    select: {
      id: true,
      nama_mk: true,
      kode_mk: true,
      total_jam: true,
      dosen: {
        select: {
          nama_dosen: true,
        },
      },
    },
  });

  if (mataKuliah.length === 0) {
    throw new ResponseError(404, "Mata Kuliah is not found");
  }

  const totalItems = await prismaClient.mataKuliah.count({
    where: {
      AND: filters,
    },
  });

  const formattedMataKuliah = mataKuliah.map((item) => ({
    id: item.id,
    nama_mk: item.nama_mk,
    kode_mk: item.kode_mk,
    total_jam: item.total_jam,
    dosen: item.dosen.nama_dosen,
  }));

  return {
    data: formattedMataKuliah,
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
