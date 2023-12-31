import Joi from "joi";

const createJurusanValidation = Joi.object({
  nama_jurusan: Joi.string().max(100).required(),
});

const getJurusanValidation = Joi.number().positive().required();

const updateJurusanValidation = Joi.object({
  id: Joi.number().positive().required(),
  nama_jurusan: Joi.string().max(100).required(),
});

const searchJurusanValidation = Joi.object({
  page: Joi.number().min(1).positive().default(1),
  size: Joi.number().min(1).positive().max(100).default(10),
  nama: Joi.string().allow("").optional(),
});

export {
  createJurusanValidation,
  updateJurusanValidation,
  getJurusanValidation,
  searchJurusanValidation,
};
