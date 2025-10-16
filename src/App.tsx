import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./components/common/ProtectedRoutes";
import AppProvider from "./providers/AppProvider";
import "./styles/index.css";
import LoginPage from "./pages/LoginPage";
import ErrorPage from "./pages/ErrorPage";
import OrganizationPage from "./pages/OrganizationPage";
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
