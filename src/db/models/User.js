import { model, Schema } from 'mongoose';
import { hendleSaveError, setUpdateSettings } from '../models/hooks.js';
import { emailRegexp } from '../../constants/users.js';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      match: emailRegexp,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    verify: {
      type: Boolean,
      default: false,
      required: true,
    },
    token: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.post('save', hendleSaveError);

userSchema.pre('findOneAndUpdate', setUpdateSettings);

userSchema.post('findOneAndUpdate', hendleSaveError);

const UserCollection = model('user', userSchema);

export default UserCollection;
