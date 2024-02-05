import Joi from 'joi';

const validateUserSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).max(20).required()

});

export default validateUserSchema;