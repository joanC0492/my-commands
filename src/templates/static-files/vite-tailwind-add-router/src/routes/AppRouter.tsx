import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthRouter } from "@/app/auth/routes/AuthRouter";

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/pokemon/*" element={"<FirstAppRouter />"} />
        <Route path="/rick-morty/*">
          <Route path="" element={"<SecondAppRouter />"} />
        </Route>
        <Route path="/auth/*" element={<AuthRouter />} />
      </Routes>
    </Router>
  );
};
