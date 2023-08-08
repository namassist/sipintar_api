import Joi from "joi";

const createTahunAjaranValidation = Joi.object({
  nama: Joi.string().max(100).required(),
});

const getTahunAjaranValidation = Joi.number().positive().required();

const updateTahunAjaranValidation = Joi.object({
  id: Joi.number().positive().required(),
  nama: Joi.string().max(100).required(),
});

const searchTahunAjaranValidation = Joi.object({
  page: Joi.number().min(1).positive().default(1),
  size: Joi.number().min(1).positive().max(100).default(10),
  nama: Joi.string().allow("").optional(),
});

export {
  createTahunAjaranValidation,
  updateTahunAjaranValidation,
  getTahunAjaranValidation,
  searchTahunAjaranValidation,
};
