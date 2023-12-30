const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description : Joi.string().required(),
        image:Joi.string().allow("",null),
        price: Joi.number().required(),
        rating:Joi.number().required().max(5).min(0),
    }).required()
})