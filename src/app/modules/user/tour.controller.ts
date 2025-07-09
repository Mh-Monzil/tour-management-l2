import { UserServices } from "./user.service";
import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await UserServices.createUserService(req.body);

  res.status(httpStatus.CREATED).json({
    message: "User created successfully",
    user,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await UserServices.getAllUsers();

  res.status(httpStatus.OK).json({
    message: "User created successfully",
    users,
  });
});

export const UserController = {
  createUser,
  getAllUsers,
};
