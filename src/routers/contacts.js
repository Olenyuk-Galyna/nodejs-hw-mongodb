import { Router } from 'express';

import * as contactsController from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(contactsController.getContactsController));

contactsRouter.get(
  '/:id',
  ctrlWrapper(contactsController.getContactByIdController),
);

contactsRouter.post('/', ctrlWrapper(contactsController.addContactController));

contactsRouter.put(
  '/:id',
  ctrlWrapper(contactsController.upsertContactController),
);

contactsRouter.patch(
  '/:id',
  ctrlWrapper(contactsController.patchtContactController),
);

contactsRouter.delete(
  '/:id',
  ctrlWrapper(contactsController.deleteContactController),
);

export default contactsRouter;
