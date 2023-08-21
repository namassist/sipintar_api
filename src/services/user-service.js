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
      mahasiswa: {
        select: {
          id: true,
          nama_mahasiswa: true,
        },
      },
      dosen: {
        select: {
          id: true,
          nama_dosen: true,
        },
      },
      admin: {
        select: {
          id: true,
          nama: true,
        },
      },
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

  let userData = {};

  switch (user.role) {
    case "Mahasiswa":
      userData = {
        id: user.mahasiswa?.id || null,
        nama: user.mahasiswa?.nama_mahasiswa || null,
      };
      break;
    case "Dosen":
      userData = {
        id: user.dosen?.id || null,
        nama: user.dosen?.nama_dosen || null,
      };
      break;
    case "Admin":
      userData = {
        id: user.admin?.id || null,
        nama: user.admin?.nama || null,
      };
      break;
    default:
      break;
  }

  const payload = {
    user_id: user.id,
    username: user.username,
    role: user.role,
    ...userData,
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
      id: dosen.id,
      nama: dosen.nama_dosen,
      nip: dosen.nip,
      jurusan: dosen.jurusan.nama_jurusan,
    };
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

    const results = {
      id: mahasiswa.id,
      nama_mahasiswa: mahasiswa.nama_mahasiswa,
      nim: mahasiswa.nim,
      kelas: mahasiswa.kelas.nama_kelas,
      tahunAjaran: mahasiswa.kelas.tahunAjaran.nama,
      prodi: mahasiswa.kelas.prodi.nama_prodi,
      jurusan: mahasiswa.kelas.prodi.jurusan.nama_jurusan,
    };

    return results;
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
