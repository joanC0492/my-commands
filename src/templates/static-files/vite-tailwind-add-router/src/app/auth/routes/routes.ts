import { LoginPage } from "@/app/auth/pages";

export enum FirstAppRoutes {
  "LOGIN" = "login",
}

interface IRoute {
  name: string;
  path: string;
  component: () => JSX.Element;
  to?: string;
}

export const routes: IRoute[] = [
  {
    path: "login",
    component: LoginPage,
    name: FirstAppRoutes.LOGIN,
  },
];