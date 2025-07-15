import z from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be string" })
    .min(2, { message: "Name too short. Minimum 3 characters long" })
    .max(50, { message: "Name too long" }),
  email: z
    .string({ invalid_type_error: "Email must be string" })
    .email({ message: "Invalid email address format" })
    .min(5, { message: "Email must be at least 5 characters long." })
    .max(100, { message: "Email cannot exceed 100 characters." }),
  // 1 uppercase, 1 special character, 1 digit, 8 characters min
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least 1 uppercase letter",
    })
    .regex(/^(?=.*\d)/, { message: "Password must contain at least 1 number" })
    .regex(/^(?=.*[!@#$%^&*()_+...])/, {
      message: "Password must contain at least 1 special character",
    }),
  phone: z
    .string({ invalid_type_error: "Phone Number must be string" })
    .optional(),
  address: z
    .string({ invalid_type_error: "Address must be string" })
    .max(200, { message: "Address cannot exceed 200 characters " })
    .optional(),
});

export const updateUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be string" })
    .min(2, { message: "Name too short. Minimum 3 characters long" })
    .max(50, { message: "Name too long" })
    .optional(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least 1 uppercase letter",
    })
    .regex(/^(?=.*\d)/, { message: "Password must contain at least 1 number" })
    .regex(/^(?=.*[!@#$%^&*()_+...])/, {
      message: "Password must contain at least 1 special character",
    })
    .optional(),
  phone: z
    .string({ invalid_type_error: "Phone Number must be string" })
    .optional(),
  address: z
    .string({ invalid_type_error: "Address must be string" })
    .max(200, { message: "Address cannot exceed 200 characters " })
    .optional(),
  role: z.enum(Object.values(Role) as [string]).optional(),
  isActive: z.enum(Object.values(IsActive) as [string]).optional(),
  isDeleted: z
    .boolean({ invalid_type_error: "isDeleted must be a true or false" })
    .optional(),
  isVerified: z
    .boolean({ invalid_type_error: "isVerified must be a true or false" })
    .optional(),
});
