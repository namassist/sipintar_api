import { prismaClient } from "../apps/database.js";
import { validate } from "../validations/validation.js";
import { ResponseError } from "../errors/response-error.js";
import {
  createProdiValidation,
  getProdiValidation,
  searchProdiValidation,
  updateProdiValidation,
} from "../validations/prodi-validation.js";

const create = async (request) => {
  const prodi = validate(createProdiValidation, request);

  const countProdi = await prismaClient.prodi.count({
    where: {
      nama_prodi: prodi.nama_prodi,
      kode_prodi: prodi.kode_prodi,
    },
  });

  if (countProdi === 1) {
    throw new ResponseError(400, "Program Studi already exists");
  }

  const createdProdi = await prismaClient.prodi.create({
    data: {
      nama_prodi: prodi.nama_prodi,
      kode_prodi: prodi.kode_prodi,
      jurusan_id: prodi.jurusan_id,
    },
    select: {
      id: true,
      nama_prodi: true,
      kode_prodi: true,
      jurusan: {
        select: {
          nama_jurusan: true,
        },
      },
    },
  });

  return {
    id: createdProdi.id,
    nama_prodi: createdProdi.nama_prodi,
    kode_prodi: createdProdi.kode_prodi,
    jurusan: createdProdi.jurusan.nama_jurusan,
  };
};

const get = async (prodiId) => {
  prodiId = validate(getProdiValidation, prodiId);

  const prodi = await prismaClient.prodi.findFirst({
    where: {
      id: prodiId,
    },
    select: {
      id: true,
      nama_prodi: true,
      kode_prodi: true,
      jurusan: {
        select: {
          nama_jurusan: true,
        },
      },
    },
  });

  if (!prodi) {
    throw new ResponseError(404, "prodi is not found");
  }

  return {
    id: prodi.id,
    nama_prodi: prodi.nama_prodi,
    kode_prodi: prodi.kode_prodi,
    jurusan: prodi.jurusan.nama_jurusan,
  };
};

const update = async (request) => {
  const prodi = validate(updateProdiValidation, request);

  const totalProdiInDatabase = await prismaClient.prodi.count({
    where: {
      id: prodi.id,
    },
  });

  if (totalProdiInDatabase !== 1) {
    throw new ResponseError(404, "Program Studi is not found");
  }

  const updatedProdi = await prismaClient.prodi.update({
    where: {
      id: prodi.id,
    },
    data: {
      nama_prodi: prodi.nama_prodi,
      kode_prodi: prodi.kode_prodi,
      jurusan_id: prodi.jurusan_id,
    },
    select: {
      id: true,
      nama_prodi: true,
      kode_prodi: true,
      jurusan: {
        select: {
          nama_jurusan: true,
        },
      },
    },
  });

  return {
    id: updatedProdi.id,
    nama_prodi: updatedProdi.nama_prodi,
    kode_prodi: updatedProdi.kode_prodi,
    jurusan: updatedProdi.jurusan.nama_jurusan,
  };
};

const remove = async (prodiId) => {
  prodiId = validate(getProdiValidation, prodiId);

  const totalInDatabase = await prismaClient.prodi.count({
    where: {
      id: prodiId,
    },
  });

  if (totalInDatabase !== 1) {
    throw new ResponseError(404, "Program Studi is not found");
  }

  return await prismaClient.prodi.delete({
    where: { id: prodiId },
  });
};

const search = async (request) => {
  request = validate(searchProdiValidation, request);

  // 1 ((page - 1) * size) = 0
  // 2 ((page - 1) * size) = 10
  const skip = (request.page - 1) * request.size;

  const filters = [];

  if (request.nama) {
    filters.push({
      OR: [
        {
          nama_prodi: {
            contains: request.nama,
          },
        },
      ],
    });
  }

  const prodi = await prismaClient.prodi.findMany({
    where: {
      AND: filters,
    },
    take: request.size,
    skip: skip,
  });

  const totalItems = await prismaClient.prodi.count({
    where: {
      AND: filters,
    },
  });

  return {
    data: prodi,
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
