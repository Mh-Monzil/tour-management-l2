import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { IsActive } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(403, "No Token Received");
      }

      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      const isUserExists = await User.findOne({
        email: verifiedToken.email,
      });

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

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "You are not permitted to view this route!");
      }

      req.user = verifiedToken;

      next();
    } catch (error) {
      next(error);
    }
  };
