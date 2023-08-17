import Joi from "joi";

const getRekapitulasiValidation = Joi.number().positive().required();

export { getRekapitulasiValidation };
