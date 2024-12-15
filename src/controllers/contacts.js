import * as contactServices from '../services/contacts.js';

import createError from 'http-errors';

export const getContactsController = async (req, res) => {
  try {
    const data = await contactServices.getContacts();

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

export const getContactByIdController = async (req, res) => {
  const { id } = req.params;
  const data = await contactServices.getContactById(id);

  if (!data) {
    throw createError(404, `Contact with id=${id} not found`);
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id=${id}`,
    data,
  });
};
