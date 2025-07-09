import { UserServices } from "./user.service";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status-codes";

const createUser = async (req: Request, res: Response) => {
  try {
    const user = await UserServices.createUserService(req.body);

    res.status(httpStatus.CREATED).json({
      message: "User created successfully",
      user,
    });
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.log(err);
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: `Something went wrong ${err.message}` });
  }
};

export const UserController = {
  createUser,
};
