import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { IsActive, IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import AppError from "../errorHelpers/AppError";
import { User } from "../modules/user/user.model";

export const createUserTokens = (user: Partial<IUser>) => {
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );

  if (!accessToken) {
    throw new Error("Failed to generate access token");
  }

  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES
  );

  if (!refreshToken) {
    throw new Error("Failed to generate refresh token");
  }

  return {
    accessToken,
    refreshToken,
  };
};

export const createNewAccessTokenWithRefreshToken = async (
  refreshToken: string
) => {
  const verifiedRefreshToken = verifyToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET
  ) as JwtPayload;

  const isUserExists = await User.findOne({
    email: verifiedRefreshToken.email,
  }).select("+password");

  if (!isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exists!");
  }
  if (
    isUserExists.isActive === IsActive.BLOCKED ||
    isUserExists.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `User is ${isUserExists.isActive.toLowerCase()}!`
    );
  }
  if (isUserExists.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is deleted!");
  }

  const JwtPayload: JwtPayload = {
    userId: isUserExists._id,
    email: isUserExists.email,
    role: isUserExists.role,
  };

  const accessToken = generateToken(
    JwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );

  return accessToken;
};
