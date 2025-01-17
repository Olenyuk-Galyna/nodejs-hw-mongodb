import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import path from 'node:path';

import { readFile } from 'node:fs/promises';
// import Handlebars from 'handlebars';

import UserCollection from '../db/models/User.js';
import SessionCollection from '../db/models/Session.js';
import {
  accessTokenLifetime,
  refreshTokenLifetime,
} from '../constants/users.js';

import jwt from 'jsonwebtoken';

import { SMTP } from '../constants/index.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendEmail } from '../utils/sendMail.js';
import { TEMPLATES_DIR } from '../constants/index.js';

const emailTemplatePath = path.join(TEMPLATES_DIR, 'verify-email.html');

const emailTemplateSource = await readFile(emailTemplatePath, 'utf-8');

const appDomain = getEnvVar('APP_DOMAIN');
const jwtSecret = getEnvVar('JWT_SECRET');

const createSessionData = () => ({
  accessToken: randomBytes(30).toString('base64'),
  refreshToken: randomBytes(30).toString('base64'),
  accessTokenValidUntil: Date.now() + accessTokenLifetime,
  refreshTokenValidUntil: Date.now() + refreshTokenLifetime,
});

export const register = async (payload) => {
  const { email, password } = payload;

  const user = await UserCollection.findOne({ email });
  if (user) throw createHttpError(409, 'Email in use');

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await UserCollection.create({
    ...payload,
    password: hashPassword,
  });

  // const template = Handlebars.compile(emailTemplateSource);

  // const token = jwt.sign({ email }, jwtSecret, { ixparesIn: '1h' });

  // const html = template({
  //   link: `${appDomain}/auth/verify?token=${token}`,
  // });

  // const verifyEmail = {
  //   to: email,
  //   subject: 'Verify email',
  //   html,
  // };

  // await sendEmail(verifyEmail);

  return newUser;
};

export const verify = async (token) => {
  try {
    const { email } = jwt.verify(token, jwtSecret);
    const user = await UserCollection.findOne({ email });

    if (!user) {
      throw createHttpError(401, 'User not found');
    }
    await UserCollection.findOneAndUpdate({ _id: user._id }, { verify: true });
  } catch (error) {
    throw createHttpError(401, error.message);
  }
};

export const login = async ({ email, password }) => {
  const user = await UserCollection.findOne({ email });
  if (!user) throw createHttpError(401, 'Email or password invalid');

  // if (!user.verify) throw createHttpError(401, 'Email not verifyed');

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) throw createHttpError(401, 'Email or password invalid');

  await SessionCollection.deleteOne({ userId: user._id });
  const sessionData = createSessionData();

  return SessionCollection.create({
    userId: user._id,
    ...sessionData,
  });
};

export const refreshToken = async ({ refreshToken, sessionId }) => {
  const oldSession = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!oldSession) {
    throw createHttpError(401, 'Session not found');
  }
  if (Date.now() > oldSession.refreshTokenValidUntil) {
    throw createHttpError(401, 'Refresh token expired');
  }
  const user = await UserCollection.findById(oldSession.userId);

  await SessionCollection.deleteOne({ _id: sessionId });

  const sessionData = createSessionData();

  return SessionCollection.create({
    userId: user._id,
    ...sessionData,
  });
};

export const requestResetToken = async (email) => {
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );

  await sendEmail({
    from: getEnvVar(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href="http://localhost:3000/reset-password?token=${resetToken}">here</a> to reset your password!</p>`,
  });
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }

  const user = await UserCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UserCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};

export const logout = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

export const getUser = (filter) => UserCollection.findOne(filter);

export const getSession = (filter) => SessionCollection.findOne(filter);
