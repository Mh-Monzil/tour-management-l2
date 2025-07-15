import httpStatus from "http-status-codes";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import SendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

const credentialsLogin = catchAsync(async (req: Request, res: Response) => {
  const loginInfo = await AuthServices.credentialsLogin(req.body);

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Logged In Successfully",
    data: loginInfo,
  });
});

export const AuthControllers = {
  credentialsLogin,
};
