import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import jwt from "jsonwebtoken";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExists = await User.findOne({ email }).select("+password");

  if (!isUserExists)
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exists!");

  const isPasswordMatched = await bcryptjs.compare(
    password as string,
    isUserExists.password as string
  );

  if (!isPasswordMatched)
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");

  const jwtPayload = {
    userId: isUserExists._id,
    email: isUserExists.email,
    role: isUserExists.role,
  };

  const accessToken = jwt.sign(jwtPayload, "secret", { expiresIn: "7d" });

  return {
    accessToken,
  };
};

export const AuthServices = {
  credentialsLogin,
};
