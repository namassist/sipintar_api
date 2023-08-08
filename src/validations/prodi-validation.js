import Joi from "joi";

const createProdiValidation = Joi.object({
  nama_prodi: Joi.string().max(100).required(),
  kode_prodi: Joi.string().max(100).required(),
  jurusan_id: Joi.number().required(),
});

const getProdiValidation = Joi.number().positive().required();

const updateProdiValidation = Joi.object({
  id: Joi.number().positive().required(),
  nama_prodi: Joi.string().max(100).required(),
  kode_prodi: Joi.string().max(100).required(),
  jurusan_id: Joi.number().required(),
});

const searchProdiValidation = Joi.object({
  page: Joi.number().min(1).positive().default(1),
  size: Joi.number().min(1).positive().max(100).default(10),
  nama: Joi.string().allow("").optional(),
  jurusan_id: Joi.string().allow("").optional(),
});

export {
  createProdiValidation,
  updateProdiValidation,
  getProdiValidation,
  searchProdiValidation,
};
