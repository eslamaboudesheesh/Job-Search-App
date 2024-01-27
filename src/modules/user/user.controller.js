import { Token } from "../../../DB/models/token.model.js";
import { User } from "../../../DB/models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import sendEmail from "../../utils/sendEmail.js";

export const signup = async (req, res, next) => {
  const { age, password, email, gender, phone, userName, confirmPassword } =
    req.body;

  // hash password  8 or 10 to bes secure and good performance
  const hashPassword = bcryptjs.hashSync(password, 8);
  const user = await User.create({
    email,
    password: hashPassword,
    age,
    gender,
    phone,
    userName,
  });
  //send email
  const token = jwt.sign({ email }, "secretKey");
  const sentMessage = await sendEmail({
    to: email,
    subject: "activate account",
    html: `<a href='http:localhost:3000/auth/activate_account/${token}'>activate account </a`,
  });
  if (!sentMessage)
    return next(new Error("Email not send"), {
      cause: StatusCodes.BAD_REQUEST,
    });

  return res
    .status(StatusCodes.CREATED)
    .json({ success: true, message: "user add successfully  " });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
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
  const token = jwt.sign({ id: user._id, email: user.email }, "secretKey");
  //save token in token model
  await Token.create({
    token,
    user: user._id,
    agent: req.headers["user-agent"],
  });
  return res
    .status(StatusCodes.OK)
    .json({ success: true, message: `welcome ${user.userName} `, token });
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
