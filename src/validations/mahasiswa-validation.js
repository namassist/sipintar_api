import Joi from "joi";

const createMahasiswaValidation = Joi.object({
  nama_mahasiswa: Joi.string().max(100).required(),
  nim: Joi.string().max(100).required(),
  kelas_id: Joi.number().required(),
  password: Joi.string().max(100).required(),
});

const getMahasiswaValidation = Joi.number().positive().required();

const updateMahasiswaValidation = Joi.object({
  id: Joi.number().positive().required(),
  nama_mahasiswa: Joi.string().max(100).required(),
  nim: Joi.string().max(100).required(),
  kelas_id: Joi.number().required(),
  password: Joi.string().max(100).required(),
});

const searchMahasiswaValidation = Joi.object({
  page: Joi.number().min(1).positive().default(1),
  size: Joi.number().min(1).positive().max(100).default(10),
  nama: Joi.string().allow("").optional(),
});

export {
  createMahasiswaValidation,
  updateMahasiswaValidation,
  getMahasiswaValidation,
  searchMahasiswaValidation,
};
