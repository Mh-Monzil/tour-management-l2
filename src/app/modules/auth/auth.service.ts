import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { createUserTokens } from "../../utils/userToken";

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

  const userTokens = createUserTokens(isUserExists);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...user } = isUserExists.toObject();

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user,
  };
};

export const AuthServices = {
  credentialsLogin,
};
