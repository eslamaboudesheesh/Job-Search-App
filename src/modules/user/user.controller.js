import { Token } from "../../../DB/models/token.model.js";
import { User } from "../../../DB/models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import sendEmail from "../../utils/sendEmail.js";
import randomstring from "randomstring";

export const signup = async (req, res, next) => {
  const { firstName, lastName, userName, email, password, recoveryEmail, DOB, mobileNumber, role, status } =
    req.body;

  // hash password  8 or 10 to bes secure and good performance
  const hashPassword = bcryptjs.hashSync(password, 8);

  const user = await User.create({
    firstName, lastName,
    email,
    recoveryEmail,
    DOB,
    mobileNumber,
    role,
    status,
    password: hashPassword,
    userName,

  });

  return res
    .status(StatusCodes.CREATED)
    .json({ success: true, message: "user add successfully  " });
};

export const login = async (req, res, next) => {
  const { emailOrMobileNumber, password } = req.body;
  const user = await User.findOne({
    $or: [
      { email: emailOrMobileNumber },
      { mobileNumber: emailOrMobileNumber }
    ]
  });

  if (!user) {
    return next(new Error("User not found"), { cause: StatusCodes.NOT_FOUND });
  }
  const match = bcryptjs.compareSync(password, user.password);
  if (!match) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: "Incorrect password" });
  }

  // generat token
  const token = jwt.sign({ id: user._id, email: user.email, mobileNumber: user.mobileNumber }, "secretKey");
  //save token in token model
  await Token.create({
    token,
    user: user._id,
    agent: req.headers["user-agent"],
  });
  // Update user status to "online"
  user.status = "online";
  await user.save();

  return res
    .status(StatusCodes.OK)
    .json({ success: true, message: `welcome ${user.userName} `, token });
};


export const updateUser = async (req, res, next) => {
  const userId = req.user._id;
  const { email, mobileNumber, recoveryEmail, DOB, lastName, firstName } = req.body;

  const user = await User.findById({ _id: userId });
  if (!user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Invalid user. Please sign up.",
    });
  }

  // Check if updated email conflicts with existing data
  if (email && (await User.exists({ email: email, _id: { $ne: userId } }))) {
    return res.status(StatusCodes.CONFLICT).json({
      success: false,
      message: "Email is already in use.",
    });
  }

  // Check if updated mobile number conflicts with existing data
  if (mobileNumber && (await User.exists({ mobileNumber: mobileNumber, _id: { $ne: userId } }))) {
    return res.status(StatusCodes.CONFLICT).json({
      success: false,
      message: "Mobile number is already in use.",
    });
  }

  const userUpdate = await User.findOneAndUpdate(
    { _id: userId },
    { email, mobileNumber, recoveryEmail, DOB, lastName, firstName },
    { new: true }
  );
  return res
    .status(StatusCodes.OK)
    .json({
      success: true, message: "user updated successfully", data: userUpdate,
    });


};

export const deleteUser = async (req, res, next) => {
  const userId = req.user._id;

  const noteExist = await User.findOneAndDelete({ _id: userId });
  return res.status(StatusCodes.OK).json({
    success: true,
    message: "User deleted successfully",
    data: noteExist,
  })

};

export const getUserData = async (req, res, next) => {
  const userId = req.user._id;
  const user = await User.findById({ _id: userId });
  return res.status(StatusCodes.OK).json({ success: true, data: user });
};

export const getUserDataById = async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById({ _id: id });
  return res.status(StatusCodes.OK).json({ success: true, data: user });
};

export const changePassword = async (req, res, next) => {
  const { password } = req.body;
  const hashPassword = bcryptjs.hashSync(password, 8);

  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { password: hashPassword },
    { new: true }
  );
  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: "User not found" });
  }
  return res
    .status(StatusCodes.OK)
    .json({ success: true, message: "password change successfully" });
};



export const getAllUsers = async (req, res, next) => {
  const allUser = await User.find({});
  return res.status(StatusCodes.OK).json({ success: true, data: allUser });
};

export const sendForgetCode = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error("User not found"), { cause: StatusCodes.NOT_FOUND });
  }

  // generate code

  const randomString = randomstring.generate({
    length: 5,
    charset: "numberic",
  });

  //save code in deb
  user.forgetCode = randomString;
  await user.save();
  //send email
  const messageSent = await sendEmail({
    to: user.email,
    subject: "activate Code",
    html: `<div>${randomString} </div>`,
  });

  if (!messageSent) return next(new Error("Email Invalid ! "));

  return res.send("you can reset you password now  !");
};


export const resetPassWord = async (req, res, next) => {
  const { email, password, code } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error("User not found"), { cause: StatusCodes.NOT_FOUND });
  }
  if (user.forgetCode !== code) {
    return next(new Error("invalid code"), { cause: StatusCodes.NOT_FOUND });
  }
  //delete forget
  await User.findOneAndUpdate({ email: email }, { $unset: { forgetCode: 1 } });
  user.password = bcryptjs.hashSync(password, 8);
  await user.save();

  const tokens = await Token.find({ user: user._id });
  tokens.forEach(async (token) => {
    token.isValid = false;
    await token.save();
  });
  return res.json({ success: true });
};