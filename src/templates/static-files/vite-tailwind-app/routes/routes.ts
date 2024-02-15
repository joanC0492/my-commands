import { HomePage } from "@/app/auth/pages";

export enum FirstAppRoutes {
  "HOME" = "home",
}

interface IRoute {
  name: string;
  path: string;
  component: () => JSX.Element;
  to?: string;
}

export const routes: IRoute[] = [
  {
    path: "home",
    component: HomePage,
    name: FirstAppRoutes.HOME,
  },
];
