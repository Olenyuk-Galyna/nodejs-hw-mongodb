import { Router } from 'express';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';

import * as contactsController from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';

import {
  createContactSchema,
  contactUpdateSchema,
} from '../validation/contacts.js';
import { upload } from '../middlewares/upload.js';

const contactsRouter = Router();
contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(contactsController.getContactsController));

contactsRouter.get(
  '/:id',
  isValidId,
  ctrlWrapper(contactsController.getContactByIdController),
);

contactsRouter.post(
  '/',
  upload.single('poster'),
  validateBody(createContactSchema),
  ctrlWrapper(contactsController.addContactController),
);

contactsRouter.put(
  '/:id',
  isValidId,
  validateBody(createContactSchema),
  ctrlWrapper(contactsController.upsertContactController),
);

contactsRouter.patch(
  '/:id',
  isValidId,
  validateBody(contactUpdateSchema),
  ctrlWrapper(contactsController.patchtContactController),
);

contactsRouter.delete(
  '/:id',
  isValidId,
  ctrlWrapper(contactsController.deleteContactController),
);

export default contactsRouter;
