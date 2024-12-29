import Joi from 'joi';
import { emailRegexp } from '../constants/users.js';

export const ausRegisterSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

export const ausLoginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});
