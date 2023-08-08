import Joi from "joi";

const createAdminValidation = Joi.object({
  nama: Joi.string().max(100).required(),
  password: Joi.string().max(100).required(),
});

const getAdminValidation = Joi.number().positive().required();

const updateAdminValidation = Joi.object({
  id: Joi.number().positive().required(),
  nama: Joi.string().max(100).required(),
  password: Joi.string().max(100).required(),
});

const searchAdminValidation = Joi.object({
  page: Joi.number().min(1).positive().default(1),
  size: Joi.number().min(1).positive().max(100).default(10),
  nama: Joi.string().allow("").optional(),
});

export {
  createAdminValidation,
  updateAdminValidation,
  getAdminValidation,
  searchAdminValidation,
};
