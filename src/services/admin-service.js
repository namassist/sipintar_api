import bcrypt from "bcrypt";
import { prismaClient } from "../apps/database.js";
import { validate } from "../validations/validation.js";
import { ResponseError } from "../errors/response-error.js";
import {
  createAdminValidation,
  getAdminValidation,
  searchAdminValidation,
  updateAdminValidation,
} from "../validations/admin-validation.js";

const create = async (request) => {
  const user = validate(createAdminValidation, request);

  const countAdmin = await prismaClient.admin.count({
    where: {
      nama: user.nama,
    },
  });

  if (countAdmin === 1) {
    throw new ResponseError(400, "Admin already exists");
  }

  user.password = await bcrypt.hash(user.password, 10);

  const createdUser = await prismaClient.user.create({
    data: {
      username: user.nama,
      password: user.password,
      role: "Admin",
    },
    select: {
      id: true,
      username: true,
    },
  });

  const createdAdmin = await prismaClient.admin.create({
    data: {
      nama: user.nama,
      user_id: createdUser.id,
    },
    select: {
      id: true,
      nama: true,
    },
  });

  return {
    id: createdAdmin.id,
    nama: createdAdmin.nama,
  };
};

const get = async (adminId) => {
  adminId = validate(getAdminValidation, adminId);

  const admin = await prismaClient.admin.findFirst({
    where: {
      id: adminId,
    },
    select: {
      id: true,
      nama: true,
    },
  });

  if (!admin) {
    throw new ResponseError(404, "admin is not found");
  }

  return {
    id: admin.id,
    nama: admin.nama,
  };
};

const update = async (request) => {
  const admin = validate(updateAdminValidation, request);

  const totalAdminInDatabase = await prismaClient.admin.count({
    where: {
      id: admin.id,
    },
  });

  if (totalAdminInDatabase !== 1) {
    throw new ResponseError(404, "Admin is not found");
  }

  admin.password = await bcrypt.hash(admin.password, 10);

  const updatedAdmin = await prismaClient.admin.update({
    where: {
      id: admin.id,
    },
    data: {
      nama: admin.nama,
    },
    select: {
      id: true,
      nama: true,
      user_id: true,
    },
  });

  const updatedUser = await prismaClient.user.update({
    where: { id: updatedAdmin.user_id },
    data: {
      username: admin.nama,
      password: admin.password,
      role: "Admin",
    },
  });

  return {
    id: updatedAdmin.id,
    nama: updatedAdmin.nama,
  };
};

const remove = async (adminId) => {
  adminId = validate(getAdminValidation, adminId);

  const totalInDatabase = await prismaClient.admin.count({
    where: {
      id: adminId,
    },
  });

  if (totalInDatabase !== 1) {
    throw new ResponseError(404, "admin is not found");
  }

  const deletedAdmin = await prismaClient.admin.delete({
    where: { id: adminId },
    select: {
      user_id: true,
    },
  });

  return prismaClient.user.delete({
    where: {
      id: deletedAdmin.user_id,
    },
  });
};

const search = async (request) => {
  request = validate(searchAdminValidation, request);

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

  const admin = await prismaClient.admin.findMany({
    where: {
      AND: filters,
    },
    take: request.size,
    skip: skip,
  });

  const totalItems = await prismaClient.admin.count({
    where: {
      AND: filters,
    },
  });

  return {
    data: admin,
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
