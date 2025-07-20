import { UserServices } from "./user.service";
import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import SendResponse from "../../utils/sendResponse";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.createUserService(req.body);

  SendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User Created Successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getAllUsers();

  SendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "All Users Retrieved Successfully",
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const verifiedToken = req.user.verifyToken;
  const payload = req.body;
  const result = await UserServices.updateUser(userId, payload, verifiedToken);

  SendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "All Users Retrieved Successfully",
    data: result,
  });
});

export const UserController = {
  createUser,
  getAllUsers,
  updateUser,
};
