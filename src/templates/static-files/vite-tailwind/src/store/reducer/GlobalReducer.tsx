import { IAuth } from "../context/GlobalProvider";

type typeAuthReducer = "[Auth] - login" | "[Auth] - logout";

interface IActionGlobal {
  type: typeAuthReducer;
  payload?: IAuth;
}

export const GlobalReducer: React.Reducer<IAuth, IActionGlobal> = (
  state,
  action
) => {
  switch (action.type) {
    case "[Auth] - login":
      return { ...state, isLogged: true };
    case "[Auth] - logout":
      return { ...state, isLogged: false };
    default:
      return state;
  }
};
