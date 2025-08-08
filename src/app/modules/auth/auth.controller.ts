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

const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged Out Successfully",
    data: null,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const decodedToken = req.user;

  await AuthServices.resetPassword(oldPassword, newPassword, decodedToken);

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successfully",
    data: null,
  });
});

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
};
