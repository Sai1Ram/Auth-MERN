import Joi from 'joi';

const validateRegisterSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).max(20).required()

});

const validateLoginSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().required()
});

export {validateRegisterSchema, validateLoginSchema};