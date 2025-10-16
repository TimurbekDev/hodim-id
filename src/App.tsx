import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./components/common/ProtectedRoutes";
import AppProvider from "./providers/AppProvider";
import "./styles/index.css";
import { ErrorPage, LoginPage, OrganizationPage } from "@/pages";
function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<ProtectedRoutes component={<OrganizationPage />} />}
          />
          <Route
            path="/organization/:orgId"
            element={<ProtectedRoutes component={<OrganizationPage />} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/error" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
