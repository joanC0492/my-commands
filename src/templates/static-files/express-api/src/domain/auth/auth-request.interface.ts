import { Login } from "./auth.interface";

export interface RequestLoginUser extends Login {
  [key: string]: unknown;
}

export interface RequestValidateToken {
  uidAuthenticated: string;
  nameAuthenticated: string;  
  [key: string]: unknown;
}
