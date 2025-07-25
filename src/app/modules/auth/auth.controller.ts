import httpStatus from "http-status-codes";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import SendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import AppError from "../../errorHelpers/AppError";

const credentialsLogin = catchAsync(async (req: Request, res: Response) => {
  const loginInfo = await AuthServices.credentialsLogin(req.body);

  res.cookie("refreshToken", loginInfo.refreshToken, {
    httpOnly: true,
    secure: false, // Set to true if using HTTPS
  });

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

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Logged In Successfully",
    data: tokenInfo,
  });
});

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
};
