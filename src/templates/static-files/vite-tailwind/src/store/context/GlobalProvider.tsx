import { createContext, useEffect, useReducer } from "react";
import { GlobalReducer } from "../reducer/GlobalReducer";

interface IProps {
  children: React.ReactNode;
}

// Lo que queremos para la app
export interface ContextProps {
  isLogged: boolean;
  login: () => void;
  logout: () => void;
}

// Lo que queremos cambiar en el reducer
export interface IAuth {
  isLogged: boolean;
}
const initGlobalReducer: IAuth = {
  isLogged: false,
};

const init = (): IAuth => JSON.parse(localStorage.getItem("AUTH") || "{}");

const GlobalContext = createContext({} as ContextProps);

const GlobalProvider: React.FC<IProps> = ({ children }) => {
  const [state, dispatch] = useReducer(GlobalReducer, initGlobalReducer, init);

  const login = () => {
    dispatch({
      type: "[Auth] - login",
    });
  };
  const logout = () => {
    dispatch({
      type: "[Auth] - logout",
    });
  };

  useEffect(() => {
    localStorage.setItem("AUTH", JSON.stringify(state));
  }, [state]);

  return (
    <GlobalContext.Provider
      value={
        {
          // Properties
          ...state,
          // methods
          login,
          logout,
        } as ContextProps
      }
    >
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalProvider, GlobalContext };