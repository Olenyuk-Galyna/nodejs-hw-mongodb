import express from 'express';
import pino from 'pino-http';
import cors from 'cors';

import { getEnvVar } from './utils/getEnvVar.js';

import * as contactServices from './services/contacts.js';

export const startServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/contacts', async (req, res) => {
    const data = await contactServices.getContacts();

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data,
    });
  });

  app.get('/contacts/:id', async (req, res) => {
    const { id } = req.params;
    const data = await contactServices.getContactById(id);

    if (!data) {
      return res.status(404).json({
        status: 404,
        message: `Contact with id=${id} not found`,
      });
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id=${id}`,
      data,
    });
  });

  app.use((req, res) => {
    res.status(404).json({
      message: `${req.url} Not found`,
    });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  const PORT = Number(getEnvVar('PORT', '3000'));

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
