import { Schema, Types, model } from "mongoose";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    recoveryEmail: {
      type: String,
      required: true,
    },
    DOB: {
      type: Date,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["User", "Company_HR"],
      required: true,
    },
    status: {
      type: String,
      enum: ["online", "offline"],
      required: true,
    },
    forgetCode: { type: String, unique: true },

  },
  { timestamps: true }
);

export const User = model("user", userSchema);
