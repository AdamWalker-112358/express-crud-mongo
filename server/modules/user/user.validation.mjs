import Joi from 'joi'

export const userSchema = Joi.object({
    first_name  : Joi.string().required(),
    last_name   : Joi.string().required(),
    email       : Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    phone       : Joi.string()
})