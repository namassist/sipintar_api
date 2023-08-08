import { validate } from "../validations/validation.js";
import {
  loginUserValidation,
  getUserValidation,
} from "../validations/user-validation.js";
import { prismaClient } from "../apps/database.js";
import { ResponseError } from "../errors/response-error.js";
import bcrypt from "bcrypt";
import pkg from "jsonwebtoken";
const { sign } = pkg;

const secretKey = "rifkasyantik";

const login = async (request) => {
  const loginRequest = validate(loginUserValidation, request);

  const user = await prismaClient.user.findUnique({
    where: {
      username: loginRequest.username,
    },
    select: {
      id: true,
      username: true,
      password: true,
      role: true,
    },
  });

  if (!user) {
    throw new ResponseError(401, "Username belum terdaftar!");
  }

  const isPasswordValid = await bcrypt.compare(
    loginRequest.password,
    user.password
  );
  if (!isPasswordValid) {
    throw new ResponseError(401, "Password salah!");
  }

  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
  };

  const token = sign(payload, secretKey);

  return prismaClient.user.update({
    data: {
      token: token,
    },
    where: {
      username: user.username,
    },
    select: {
      token: true,
    },
  });
};

const get = async (username) => {
  username = validate(getUserValidation, username);

  const user = await prismaClient.user.findUnique({
    where: {
      username: username,
    },
    select: {
      id: true,
      username: true,
      role: true,
    },
  });

  if (!user) {
    throw new ResponseError(404, "user is not found");
  }

  if (user.role === "Dosen") {
    const dosen = await prismaClient.dosen.findUnique({
      where: {
        nip: user.username,
        user_id: user.id,
      },
      select: {
        id: true,
        username: true,
        nip: true,
        jurusan: true,
      },
    });

    return dosen;
  }

  if (user.role === "Mahasiswa") {
    const mahasiswa = await prismaClient.mahasiswa.findUnique({
      where: {
        nim: user.username,
        user_id: user.id,
      },
      select: {
        id: true,
        nama_mahasiswa: true,
        nim: true,
        kelas: {
          select: {
            nama_kelas: true,
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

    return mahasiswa;
  }

  return user;
};

const logout = async (username) => {
  username = validate(getUserValidation, username);

  const user = await prismaClient.user.findUnique({
    where: {
      username: username,
    },
  });

  if (!user) {
    throw new ResponseError(404, "user is not found");
  }

  return prismaClient.user.update({
    where: {
      username: username,
    },
    data: {
      token: null,
    },
    select: {
      username: true,
      role: true,
    },
  });
};

export default {
  login,
  logout,
  get,
};
