import { validate } from "../validations/validation.js";
import { loginUserValidation } from "../validations/user-validation.js";
import { prismaClient } from "../apps/database.js";
import { ResponseError } from "../errors/response-error.js";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
// import { v4 as uuid } from "uuid";

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
      role_id: true,
    },
    include: {
      role: {
        select: {
          name: true,
        },
      },
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
    role: user.role.name,
  };

  const token = sign(payload, secretKey);
  //   const token = uuid().toString();

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

export default {
  login,
};
