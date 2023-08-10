import bcrypt from "bcrypt";
import { prismaClient } from "../apps/database.js";
import { validate } from "../validations/validation.js";
import { ResponseError } from "../errors/response-error.js";
import {
  createMahasiswaValidation,
  getMahasiswaValidation,
  searchMahasiswaValidation,
  updateMahasiswaValidation,
} from "../validations/mahasiswa-validation.js";

const create = async (request) => {
  const user = validate(createMahasiswaValidation, request);

  const countMahasiswa = await prismaClient.mahasiswa.count({
    where: {
      nim: user.nim,
    },
  });

  if (countMahasiswa === 1) {
    throw new ResponseError(400, "Mahasiswa already exists");
  }

  user.password = await bcrypt.hash(user.password, 10);

  const createdUser = await prismaClient.user.create({
    data: {
      username: user.nim,
      password: user.password,
      role: "Mahasiswa",
    },
    select: {
      id: true,
      username: true,
    },
  });

  const createdMahasiswa = await prismaClient.mahasiswa.create({
    data: {
      nama_mahasiswa: user.nama_mahasiswa,
      nim: user.nim,
      kelas_id: user.kelas_id,
      user_id: createdUser.id,
    },
    select: {
      id: true,
      nama_mahasiswa: true,
      nim: true,
      kelas: {
        select: {
          nama_kelas: true,
        },
      },
    },
  });

  return {
    id: createdMahasiswa.id,
    nama_mahasiswa: createdMahasiswa.nama_mahasiswa,
    nim: createdMahasiswa.nim,
    kelas: createdMahasiswa.kelas.nama_kelas,
  };
};

const get = async (mahasiswaId) => {
  mahasiswaId = validate(getMahasiswaValidation, mahasiswaId);

  const mahasiswa = await prismaClient.mahasiswa.findFirst({
    where: {
      id: mahasiswaId,
    },
    select: {
      id: true,
      nama_mahasiswa: true,
      nim: true,
      kelas: {
        select: {
          nama_kelas: true,
        },
      },
    },
  });

  if (!mahasiswa) {
    throw new ResponseError(404, "mahasiswa is not found");
  }

  return {
    id: mahasiswa.id,
    nama_mahasiswa: mahasiswa.nama_mahasiswa,
    nim: mahasiswa.nim,
    kelas: mahasiswa.kelas.nama_kelas,
  };
};

const update = async (request) => {
  const mahasiswa = validate(updateMahasiswaValidation, request);

  const totalMahasiswaInDatabase = await prismaClient.mahasiswa.count({
    where: {
      id: mahasiswa.id,
    },
  });

  if (totalMahasiswaInDatabase !== 1) {
    throw new ResponseError(404, "Mahasiswa is not found");
  }

  mahasiswa.password = await bcrypt.hash(mahasiswa.password, 10);

  const updatedMahasiswa = await prismaClient.mahasiswa.update({
    where: {
      id: mahasiswa.id,
    },
    data: {
      nama_mahasiswa: mahasiswa.nama_mahasiswa,
      nim: mahasiswa.nim,
      kelas_id: mahasiswa.kelas_id,
    },
    select: {
      id: true,
      nama_mahasiswa: true,
      nim: true,
      user_id: true,
      kelas: {
        select: {
          nama_kelas: true,
        },
      },
    },
  });

  const updatedUser = await prismaClient.user.update({
    where: { id: updatedMahasiswa.user_id },
    data: {
      username: mahasiswa.nim,
      password: mahasiswa.password,
      role: "Mahasiswa",
    },
  });

  return {
    id: updatedMahasiswa.id,
    nama_mahasiswa: updatedMahasiswa.nama_mahasiswa,
    nim: updatedMahasiswa.nim,
    kelas: updatedMahasiswa.kelas.nama_kelas,
  };
};

const remove = async (mahasiswaId) => {
  mahasiswaId = validate(getMahasiswaValidation, mahasiswaId);

  const totalInDatabase = await prismaClient.mahasiswa.count({
    where: {
      id: mahasiswaId,
    },
  });

  if (totalInDatabase !== 1) {
    throw new ResponseError(404, "mahasiswa is not found");
  }

  const deletedMahasiswa = await prismaClient.mahasiswa.delete({
    where: { id: mahasiswaId },
    select: {
      user_id: true,
    },
  });

  return prismaClient.user.delete({
    where: {
      id: deletedMahasiswa.user_id,
    },
  });
};

const search = async (request) => {
  request = validate(searchMahasiswaValidation, request);

  // 1 ((page - 1) * size) = 0
  // 2 ((page - 1) * size) = 10
  const skip = (request.page - 1) * request.size;

  const filters = [];

  if (request.nama) {
    filters.push({
      OR: [
        {
          nama_mahasiswa: {
            contains: request.nama,
          },
        },
      ],
    });
  }

  const mahasiswas = await prismaClient.mahasiswa.findMany({
    where: {
      AND: filters,
    },
    take: request.size,
    skip: skip,
    select: {
      id: true,
      nama_mahasiswa: true,
      nim: true,
      kelas: {
        select: {
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
      },
    },
  });

  const totalItems = await prismaClient.mahasiswa.count({
    where: {
      AND: filters,
    },
  });

  const results = mahasiswas.map((mahasiswa) => ({
    id: mahasiswa.id,
    nama_mahasiswa: mahasiswa.nama_mahasiswa,
    nim: mahasiswa.nim,
    kelas: mahasiswa.kelas.nama_kelas,
    tahunAjaran: mahasiswa.kelas.kelas.tahunAjaran,
    prodi: mahasiswa.kelas.prodi.nama_prodi,
    jurusan: mahasiswa.kelas.prodi.jurusan.nama_jurusan,
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
  get,
  create,
  update,
  remove,
  search,
};
