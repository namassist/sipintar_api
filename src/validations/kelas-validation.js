import Joi from "joi";

const createKelasValidation = Joi.object({
  nama_kelas: Joi.string().max(100).required(),
  tahun_ajaran_id: Joi.number().required(),
  prodi_id: Joi.number().required(),
});

const getKelasValidation = Joi.number().positive().required();

const updateKelasValidation = Joi.object({
  id: Joi.number().positive().required(),
  nama_kelas: Joi.string().max(100).required(),
  tahun_ajaran_id: Joi.number().required(),
  prodi_id: Joi.number().required(),
});

const searchKelasValidation = Joi.object({
  page: Joi.number().min(1).positive().default(1),
  size: Joi.number().min(1).positive().max(100).default(10),
  nama: Joi.string().allow("").optional(),
  prodi_id: Joi.string().allow("").optional(),
});

export {
  createKelasValidation,
  updateKelasValidation,
  getKelasValidation,
  searchKelasValidation,
};
