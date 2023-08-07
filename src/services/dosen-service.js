import bcrypt from "bcrypt";
import { prismaClient } from "../apps/database.js";
import { validate } from "../validations/validation.js";
import { ResponseError } from "../errors/response-error.js";
import {
  createDosenValidation,
  getDosenValidation,
  searchDosenValidation,
  updateDosenValidation,
} from "../validations/dosen-validation.js";

const create = async (request) => {
  const user = validate(createDosenValidation, request);

  const countMahasiswa = await prismaClient.dosen.count({
    where: {
      nip: user.nip,
    },
  });

  if (countMahasiswa === 1) {
    throw new ResponseError(400, "Dosen already exists");
  }

  user.password = await bcrypt.hash(user.password, 10);

  const createdUser = await prismaClient.user.create({
    data: {
      username: user.nip,
      password: user.password,
      role: "Dosen",
    },
    select: {
      id: true,
      username: true,
    },
  });

  const createdDosen = await prismaClient.dosen.create({
    data: {
      nama_dosen: user.nama_dosen,
      nip: user.nip,
      jurusan_id: user.jurusan_id,
      user_id: createdUser.id,
    },
    select: {
      id: true,
      nama_dosen: true,
      nip: true,
      jurusan: {
        select: {
          nama_jurusan: true,
        },
      },
    },
  });

  return {
    id: createdDosen.id,
    nama_dosen: createdDosen.nama_dosen,
    nip: createdDosen.nip,
    kelas: createdDosen.jurusan.nama_jurusan,
  };
};

const get = async (dosenId) => {
  dosenId = validate(getDosenValidation, dosenId);

  const dosen = await prismaClient.dosen.findFirst({
    where: {
      id: dosenId,
    },
    select: {
      id: true,
      nama_dosen: true,
      nip: true,
      jurusan: {
        select: {
          nama_jurusan: true,
        },
      },
    },
  });

  if (!dosen) {
    throw new ResponseError(404, "Dosen is not found");
  }

  return {
    id: dosen.id,
    nama_dosen: dosen.nama_dosen,
    nip: dosen.nip,
    jurusan: dosen.jurusan.nama_jurusan,
  };
};

const update = async (request) => {
  const dosen = validate(updateDosenValidation, request);

  const totalDosenInDatabase = await prismaClient.dosen.count({
    where: {
      id: dosen.id,
    },
  });

  if (totalDosenInDatabase !== 1) {
    throw new ResponseError(404, "Dosen is not found");
  }

  dosen.password = await bcrypt.hash(dosen.password, 10);

  const updatedDosen = await prismaClient.dosen.update({
    where: {
      id: dosen.id,
    },
    data: {
      nama_dosen: dosen.nama_dosen,
      nip: dosen.nip,
      kelas_id: dosen.kelas_id,
    },
    select: {
      id: true,
      nama_dosen: true,
      nip: true,
      user_id: true,
      jurusan: {
        select: {
          nama_jurusan: true,
        },
      },
    },
  });

  const updatedUser = await prismaClient.user.update({
    where: { id: updatedDosen.user_id },
    data: {
      username: dosen.nip,
      password: dosen.password,
      role: "Dosen",
    },
  });

  return {
    id: updatedDosen.id,
    nama_dosen: updatedDosen.nama_dosen,
    nip: updatedDosen.nip,
    jurusan: updatedDosen.jurusan.nama_jurusan,
  };
};

const remove = async (dosenId) => {
  dosenId = validate(getDosenValidation, dosenId);

  const totalInDatabase = await prismaClient.dosen.count({
    where: {
      id: dosenId,
    },
  });

  if (totalInDatabase !== 1) {
    throw new ResponseError(404, "Dosen is not found");
  }

  const deletedDosen = await prismaClient.dosen.delete({
    where: { id: dosenId },
    select: {
      user_id: true,
    },
  });

  return prismaClient.user.delete({
    where: {
      id: deletedDosen.user_id,
    },
  });
};

const search = async (request) => {
  request = validate(searchDosenValidation, request);

  // 1 ((page - 1) * size) = 0
  // 2 ((page - 1) * size) = 10
  const skip = (request.page - 1) * request.size;

  const filters = [];

  if (request.nama) {
    filters.push({
      OR: [
        {
          nama_dosen: {
            contains: request.nama,
          },
        },
      ],
    });
  }

  const dosen = await prismaClient.dosen.findMany({
    where: {
      AND: filters,
    },
    take: request.size,
    skip: skip,
  });

  const totalItems = await prismaClient.dosen.count({
    where: {
      AND: filters,
    },
  });

  return {
    data: dosen,
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
