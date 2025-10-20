import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoutes from "@/components/common/ProtectedRoutes";
import AppProvider from "@/providers/AppProvider";
import "@/styles/index.css";
import { ErrorPage, LoginPage, OrganizationPage } from "@/pages";
<<<<<<< HEAD
import ProfilePage from "@/pages/ProfilePage";
=======
import ClientPage from "./pages/ClientPage";
>>>>>>> e79bd9ac4c3554ffac798d28e84ef4adab8e94c9
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
          <Route
<<<<<<< HEAD
          path="/profile/:userId"
          element={<ProtectedRoutes component={<ProfilePage />} />} />
=======
            path='/organization/:orgId/clients'
            element={<ProtectedRoutes component={<ClientPage />} />} />

>>>>>>> e79bd9ac4c3554ffac798d28e84ef4adab8e94c9
          <Route path="/login" element={<LoginPage />} />
          <Route path="/error" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
