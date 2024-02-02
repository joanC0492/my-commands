import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthRouter } from "@/app/auth/routes/AuthRouter";

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={"Pagina de Inicio :)"} />
        <Route path="/home" element={<Navigate replace to="/" />} />
        <Route path="/auth/*" element={<AuthRouter />} />
        <Route path="*" element={"404 Not Found"} />
      </Routes>
    </Router>
  );
};
