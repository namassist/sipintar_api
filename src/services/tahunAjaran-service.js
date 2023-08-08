import { prismaClient } from "../apps/database.js";
import { validate } from "../validations/validation.js";
import { ResponseError } from "../errors/response-error.js";
import {
  createTahunAjaranValidation,
  getTahunAjaranValidation,
  searchTahunAjaranValidation,
  updateTahunAjaranValidation,
} from "../validations/tahunAjaran-validation.js";

const create = async (request) => {
  const tahunAjaran = validate(createTahunAjaranValidation, request);

  const countTahunAjaran = await prismaClient.tahunAjaran.count({
    where: {
      nama: tahunAjaran.nama,
    },
  });

  if (countTahunAjaran === 1) {
    throw new ResponseError(400, "Tahun Ajaran already exists");
  }

  return await prismaClient.tahunAjaran.create({
    data: {
      nama: tahunAjaran.nama,
    },
    select: {
      id: true,
      nama: true,
    },
  });
};

const get = async (tahunAjaranid) => {
  tahunAjaranid = validate(getTahunAjaranValidation, tahunAjaranid);

  const tahunAjaran = await prismaClient.tahunAjaran.findFirst({
    where: {
      id: tahunAjaranid,
    },
    select: {
      id: true,
      nama: true,
    },
  });

  if (!tahunAjaran) {
    throw new ResponseError(404, "Tahun Ajaran is not found");
  }

  return {
    id: tahunAjaran.id,
    nama: tahunAjaran.nama,
  };
};

const update = async (request) => {
  const tahunAjaran = validate(updateTahunAjaranValidation, request);

  const totalTahunAjaranInDatabase = await prismaClient.tahunAjaran.count({
    where: {
      id: tahunAjaran.id,
    },
  });

  if (totalTahunAjaranInDatabase !== 1) {
    throw new ResponseError(404, "Tahun Ajaran is not found");
  }

  return await prismaClient.tahunAjaran.update({
    where: {
      id: tahunAjaran.id,
    },
    data: {
      nama: tahunAjaran.nama,
    },
    select: {
      id: true,
      nama: true,
    },
  });
};

const remove = async (tahunAjaranId) => {
  tahunAjaranId = validate(getTahunAjaranValidation, tahunAjaranId);

  const totalInDatabase = await prismaClient.tahunAjaran.count({
    where: {
      id: tahunAjaranId,
    },
  });

  if (totalInDatabase !== 1) {
    throw new ResponseError(404, "Tahun Ajaran is not found");
  }

  return await prismaClient.tahunAjaran.delete({
    where: { id: tahunAjaranId },
  });
};

const search = async (request) => {
  request = validate(searchTahunAjaranValidation, request);

  // 1 ((page - 1) * size) = 0
  // 2 ((page - 1) * size) = 10
  const skip = (request.page - 1) * request.size;

  const filters = [];

  if (request.nama) {
    filters.push({
      OR: [
        {
          nama: {
            contains: request.nama,
          },
        },
      ],
    });
  }

  const tahunAjaran = await prismaClient.tahunAjaran.findMany({
    where: {
      AND: filters,
    },
    take: request.size,
    skip: skip,
  });

  const totalItems = await prismaClient.tahunAjaran.count({
    where: {
      AND: filters,
    },
  });

  return {
    data: tahunAjaran,
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
