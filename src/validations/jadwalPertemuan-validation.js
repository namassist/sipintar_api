import Joi from "joi";

const createJadwalPertemuanValidation = Joi.object({
  hari: Joi.string().max(100).required(),
  total_jam: Joi.number().required(),
  jam_mulai: Joi.string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required(),
  jam_akhir: Joi.string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required(),
  waktu_realisasi: Joi.date().required(),
  ruangan: Joi.string().max(100).required(),
  topik_perkuliahan: Joi.string().required(),
  kelas_mk_dosen_id: Joi.number().required(),
}).custom((value, helpers) => {
  if (value.jam_mulai && value.jam_akhir && value.jam_mulai < value.jam_akhir) {
    return value;
  }
  return helpers.error("any.invalid");
}, "custom.greaterThanStartTime");

const getJadwalPertemuanValidation = Joi.number().positive().required();

const updateJadwalPertemuanValidation = Joi.object({
  id: Joi.number().positive().required(),
  status: Joi.boolean().required(),
});

export {
  createJadwalPertemuanValidation,
  updateJadwalPertemuanValidation,
  getJadwalPertemuanValidation,
};
