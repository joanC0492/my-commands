import { HttpStatusCode } from "../types";
import { UserResponse } from "../user";

export type ResponseLoginUser = {
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

export type ResponseValidateToken = {
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