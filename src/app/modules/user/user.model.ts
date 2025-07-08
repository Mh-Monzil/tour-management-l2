import { model, Schema } from "mongoose";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";

const AuthProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  {
    _id: false, // Disable _id for subDocuments
    versionKey: false, // Disable __v field for subDocuments
  }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false }, // Exclude password from queries by default
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    phone: { type: String },
    picture: { type: String },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    isVerified: { type: Boolean, default: false },
    auths: [AuthProviderSchema],
    // bookings: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
    // guides: [{ type: Schema.Types.ObjectId, ref: "Guide" }],
  },
  {
    timestamps: true,
    versionKey: false, // Disable __v field
  }
);

export const User = model<IUser>("User", userSchema);
