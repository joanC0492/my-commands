import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthRouter } from "@/app/auth/routes/AuthRouter";

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={"Pagina de Inicio :)"} />
        <Route path="/*" element={<Navigate replace to="/" />} />
        <Route path="/auth/*" element={<AuthRouter />} />
      </Routes>
    </Router>
  );
};
