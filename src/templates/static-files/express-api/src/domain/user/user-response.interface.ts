import { HttpStatusCode } from "../types";
import { User } from "./user.interface";

export interface UserResponse {
  uid: string;
  name: string;
  token: string;
}

export type ResponseCreateUser = {
  status: HttpStatusCode;
} & (
  | {
      ok: true;
      data: UserResponse;
    }
  | {
      ok: false;
      msg: string;
    }
);


export interface UserFromDb extends Document, User {}
