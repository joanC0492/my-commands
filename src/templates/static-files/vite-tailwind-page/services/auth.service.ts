import { IUser } from "../domain/auth.domain";

const login = async (): Promise<IUser> => {
  const user: IUser = {
    name: "Joan",
    email: "joancc04@gmail.com",
    isLogged: true,
  };
  await takeABreak();
  return user;
};

const takeABreak = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 2500);
  });
};

const AuthService = {
  login,
};

export default AuthService;
