import { Schema, model } from "mongoose";
import { User } from "../../domain/user";

const UserSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    state: {
      type: Boolean,
      default: true,
    },
  },
  {
    // add "createdAt" "updatedAt"
    timestamps: true,
    // Delete "__v" in the document
    versionKey: false,
  }
);

export const UserModel = model("users", UserSchema);