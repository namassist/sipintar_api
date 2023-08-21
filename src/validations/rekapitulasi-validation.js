import Joi from "joi";

const getRekapitulasiValidation = Joi.number().positive().required();

const searchRekapitulasiValidation = Joi.object({
  page: Joi.number().min(1).positive().default(1),
  size: Joi.number().min(1).positive().max(100).default(10),
  kelas_id: Joi.string().allow("").optional(),
});

export { getRekapitulasiValidation, searchRekapitulasiValidation };
