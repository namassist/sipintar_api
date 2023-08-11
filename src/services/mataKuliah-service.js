import { prismaClient } from "../apps/database.js";
import { validate } from "../validations/validation.js";
import { ResponseError } from "../errors/response-error.js";
import {
  createMataKuliahValidation,
  getMataKuliahValidation,
  searchMataKuliahValidation,
  updateMataKuliahValidation,
} from "../validations/mataKuliah-validation.js";
import { getDosenValidation } from "../validations/dosen-validation.js";
import { getMahasiswaValidation } from "../validations/mahasiswa-validation.js";

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
    },
    select: {
      id: true,
      nama_mk: true,
      kode_mk: true,
      total_jam: true,
    },
  });

  return {
    id: createdMataKuliah.id,
    nama_mk: createdMataKuliah.nama_mk,
    kode_mk: createdMataKuliah.kode_mk,
    total_jam: createdMataKuliah.total_jam,
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
    },
    select: {
      id: true,
      nama_mk: true,
      kode_mk: true,
      total_jam: true,
    },
  });

  return {
    id: updatedMataKuliah.id,
    nama_mk: updatedMataKuliah.nama_mk,
    kode_mk: updatedMataKuliah.kode_mk,
    total_jam: updatedMataKuliah.total_jam,
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

  return {
    data: mataKuliah,
    paging: {
      page: request.page,
      total_item: totalItems,
      total_page: Math.ceil(totalItems / request.size),
    },
  };
};

const listDosen = async (dosenId) => {
  dosenId = await checkDosenMustExists(dosenId);

  const kelasMataKuliahDosen = await prismaClient.kelasMataKuliahDosen.findMany(
    {
      where: {
        dosen_id: dosenId,
      },
      select: {
        kelas_mk_dosen_id: true,
        mataKuliah: {
          select: {
            nama_mk: true,
            kode_mk: true,
            total_jam: true,
          },
        },
        kelas: {
          select: {
            nama_kelas: true,
          },
        },
        dosen: {
          select: {
            nama_dosen: true,
          },
        },
      },
    }
  );

  const results = kelasMataKuliahDosen.map((item) => ({
    kelas_mk_id: item.kelas_mk_dosen_id,
    nama_mk: item.mataKuliah.nama_mk,
    kode_mk: item.mataKuliah.kode_mk,
    total_jam: item.mataKuliah.total_jam,
    kelas: item.kelas.nama_kelas,
  }));

  return results;
};

const listMahasiswa = async (mahasiswaId) => {
  mahasiswaId = await checkMahasiswaMustExists(mahasiswaId);

  const kelasMahasiswa = await prismaClient.mahasiswa.findUnique({
    where: {
      id: mahasiswaId,
    },
    select: {
      nama_mahasiswa: true,
      kelas_id: true,
    },
  });

  const kelasMataKuliahDosen = await prismaClient.kelasMataKuliahDosen.findMany(
    {
      where: {
        kelas_id: kelasMahasiswa.kelas_id,
      },
      select: {
        kelas_mk_dosen_id: true,
        mataKuliah: {
          select: {
            nama_mk: true,
            kode_mk: true,
            total_jam: true,
          },
        },
        kelas: {
          select: {
            nama_kelas: true,
          },
        },
        dosen: {
          select: {
            nama_dosen: true,
          },
        },
      },
    }
  );

  const results = kelasMataKuliahDosen.map((item) => ({
    kelas_mk_id: item.kelas_mk_dosen_id,
    nama_mk: item.mataKuliah.nama_mk,
    kode_mk: item.mataKuliah.kode_mk,
    total_jam: item.mataKuliah.total_jam,
    kelas: item.kelas.nama_kelas,
    dosen: item.dosen.nama_dosen,
  }));

  return results;
};

export default {
  get,
  create,
  update,
  remove,
  search,
  listDosen,
  listMahasiswa,
};
