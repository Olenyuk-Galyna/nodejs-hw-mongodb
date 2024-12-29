import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { ausLoginSchema, ausRegisterSchema } from '../validation/auth.js';
import * as ausController from '../controllers/auth.js';
import { validateBody } from '../utils/validateBody.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(ausRegisterSchema),
  ctrlWrapper(ausController.registerController),
);

authRouter.post(
  '/login',
  validateBody(ausLoginSchema),
  ctrlWrapper(ausController.loginController),
);

export default authRouter;
