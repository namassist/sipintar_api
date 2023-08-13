import Joi from "joi";

const createPresensiValidation = Joi.object({
  mahasiswa_id: Joi.number(),
  waktu_presensi: Joi.date().required(),
  qr_code: Joi.string().required(),
});

const getPresensiValidation = Joi.number().positive().required();

const updatePresensiValidation = Joi.object({
  mahasiswa_id: Joi.number(),
  waktu_presensi: Joi.date().required(),
  qr_code: Joi.string().required(),
});

export {
  createPresensiValidation,
  updatePresensiValidation,
  getPresensiValidation,
};
