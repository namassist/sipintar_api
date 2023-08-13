import Joi from "joi";

const createMataKuliahValidation = Joi.object({
  nama_mk: Joi.string().max(100).required(),
  kode_mk: Joi.string().max(100).required(),
});

const getMataKuliahValidation = Joi.number().positive().required();

const updateMataKuliahValidation = Joi.object({
  id: Joi.number().positive().required(),
  nama_mk: Joi.string().max(100).required(),
  kode_mk: Joi.string().max(100).required(),
});

const searchMataKuliahValidation = Joi.object({
  page: Joi.number().min(1).positive().default(1),
  size: Joi.number().min(1).positive().max(100).default(10),
  nama: Joi.string().allow("").optional(),
  kode: Joi.string().allow("").optional(),
});

export {
  createMataKuliahValidation,
  updateMataKuliahValidation,
  getMataKuliahValidation,
  searchMataKuliahValidation,
};
