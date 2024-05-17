import { User } from "./user.interface";

export interface RequestCreateUser extends User {
  [key: string]: unknown;
}