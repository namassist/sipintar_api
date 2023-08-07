import { prismaClient } from "../apps/database.js";
import { validate } from "../validations/validation.js";
import { ResponseError } from "../errors/response-error.js";
import {
  createJurusanValidation,
  getJurusanValidation,
  searchJurusanValidation,
  updateJurusanValidation,
} from "../validations/jurusan-validation.js";

const create = async (request) => {
  const jurusan = validate(createJurusanValidation, request);

  const countJurusan = await prismaClient.jurusan.count({
    where: {
      nama_jurusan: jurusan.nama_jurusan,
    },
  });

  if (countJurusan === 1) {
    throw new ResponseError(400, "Jurusan already exists");
  }

  return await prismaClient.jurusan.create({
    data: {
      nama_jurusan: jurusan.nama_jurusan,
    },
    select: {
      id: true,
      nama_jurusan: true,
    },
  });
};

const get = async (jurusanId) => {
  jurusanId = validate(getJurusanValidation, jurusanId);

  const jurusan = await prismaClient.jurusan.findFirst({
    where: {
      id: jurusanId,
    },
    select: {
      id: true,
      nama_jurusan: true,
    },
  });

  if (!jurusan) {
    throw new ResponseError(404, "Jurusan is not found");
  }

  return {
    id: jurusan.id,
    nama_jurusan: jurusan.nama_jurusan,
  };
};

const update = async (request) => {
  const jurusan = validate(updateJurusanValidation, request);

  const totalJurusanInDatabase = await prismaClient.jurusan.count({
    where: {
      id: jurusan.id,
    },
  });

  if (totalJurusanInDatabase !== 1) {
    throw new ResponseError(404, "Jurusan is not found");
  }

  return await prismaClient.jurusan.update({
    where: {
      id: jurusan.id,
    },
    data: {
      nama_jurusan: jurusan.nama_jurusan,
    },
    select: {
      id: true,
      nama_jurusan: true,
    },
  });
};

const remove = async (jurusanId) => {
  jurusanId = validate(getJurusanValidation, jurusanId);

  const totalInDatabase = await prismaClient.jurusan.count({
    where: {
      id: jurusanId,
    },
  });

  if (totalInDatabase !== 1) {
    throw new ResponseError(404, "Jurusan is not found");
  }

  return await prismaClient.jurusan.delete({
    where: { id: jurusanId },
  });
};

const search = async (request) => {
  request = validate(searchJurusanValidation, request);

  // 1 ((page - 1) * size) = 0
  // 2 ((page - 1) * size) = 10
  const skip = (request.page - 1) * request.size;

  const filters = [];

  if (request.nama) {
    filters.push({
      OR: [
        {
          nama_jurusan: {
            contains: request.nama,
          },
        },
      ],
    });
  }

  const jurusan = await prismaClient.jurusan.findMany({
    where: {
      AND: filters,
    },
    take: request.size,
    skip: skip,
  });

  const totalItems = await prismaClient.jurusan.count({
    where: {
      AND: filters,
    },
  });

  return {
    data: jurusan,
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
