import Joi from "joi";

const createDosenValidation = Joi.object({
  nama_dosen: Joi.string().max(100).required(),
  nip: Joi.string().max(100).required(),
  jurusan_id: Joi.number().required(),
  password: Joi.string().max(100).required(),
});

const getDosenValidation = Joi.number().positive().required();

const updateDosenValidation = Joi.object({
  id: Joi.number().positive().required(),
  nama_dosen: Joi.string().max(100).required(),
  nip: Joi.string().max(100).required(),
  jurusan_id: Joi.number().required(),
  password: Joi.string().max(100).required(),
});

const searchDosenValidation = Joi.object({
  page: Joi.number().min(1).positive().default(1),
  size: Joi.number().min(1).positive().max(100).default(10),
  nama: Joi.string().allow("").optional(),
});

export {
  createDosenValidation,
  updateDosenValidation,
  getDosenValidation,
  searchDosenValidation,
};
