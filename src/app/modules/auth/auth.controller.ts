import httpStatus from "http-status-codes";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import SendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import AppError from "../../errorHelpers/AppError";
import { setAuthCookies } from "../../utils/setCookie";

const credentialsLogin = catchAsync(async (req: Request, res: Response) => {
  const loginInfo = await AuthServices.credentialsLogin(req.body);

  if (!loginInfo.accessToken || !loginInfo.refreshToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Authentication failed");
  }

  // Set cookies for access and refresh tokens
  setAuthCookies(res, loginInfo);

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Logged In Successfully",
    data: loginInfo,
  });
});

const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Refresh token is required");
  }
  const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);

  setAuthCookies(res, tokenInfo);

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New Access Token Generated Successfully",
    data: tokenInfo,
  });
});

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
};
