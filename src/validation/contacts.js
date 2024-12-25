import Joi from 'joi';
import { typeList } from '../constants/contactsConstants.js';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string().min(3).max(20),
  contactType: Joi.string()
    .valid(...typeList)
    .required(),
  isFavourite: Joi.boolean(),
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string().min(3).max(20),
  contactType: Joi.string()
    .valid(...typeList)
    .required(),
  isFavourite: Joi.boolean(),
});
