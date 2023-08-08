import Joi from "joi";

const createJadwalValidation = Joi.object({
  hari: Joi.string().max(100).required(),
  jam_mulai: Joi.string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required(),
  jam_akhir: Joi.string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required(),
  ruangan: Joi.string().max(100).required(),
  kelas_id: Joi.number().required(),
  tahun_ajaran_id: Joi.number().required(),
  mata_kuliah_id: Joi.number().required(),
  dosen_id: Joi.number().required(),
}).custom((value, helpers) => {
  if (value.jam_mulai && value.jam_akhir && value.jam_mulai < value.jam_akhir) {
    return value;
  }
  return helpers.error("any.invalid");
}, "custom.greaterThanStartTime");

const getJadwalValidation = Joi.number().positive().required();

const updateJadwalValidation = Joi.object({
  id: Joi.number().positive().required(),
  hari: Joi.string().max(100).required(),
  jam_mulai: Joi.string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required(),
  jam_akhir: Joi.string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required(),
  ruangan: Joi.string().max(100).required(),
  kelas_id: Joi.number().required(),
  tahun_ajaran_id: Joi.number().required(),
  mata_kuliah_id: Joi.number().required(),
  dosen_id: Joi.number().required(),
}).custom((value, helpers) => {
  if (value.jam_mulai && value.jam_akhir && value.jam_mulai < value.jam_akhir) {
    return value;
  }
  return helpers.error("any.invalid");
}, "custom.greaterThanStartTime");

const searchJadwalValidation = Joi.object({
  page: Joi.number().min(1).positive().default(1),
  size: Joi.number().min(1).positive().max(100).default(10),
  kelas_id: Joi.string().allow("").optional(),
  tahun_ajaran_id: Joi.string().allow("").optional(),
});

export {
  createJadwalValidation,
  updateJadwalValidation,
  getJadwalValidation,
  searchJadwalValidation,
};
