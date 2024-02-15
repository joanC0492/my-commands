import { AppRouter } from "@/routes/AppRouter";
import { GlobalProvider } from "./store/context/GlobalProvider";

export const App = () => {
  return (
    <GlobalProvider>
      <AppRouter />
    <GlobalProvider>
  );
};
