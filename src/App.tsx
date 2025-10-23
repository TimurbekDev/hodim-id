import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoutes from "@/components/common/ProtectedRoutes";
import AppProvider from "@/providers/AppProvider";
import "@/styles/index.css";
import { ErrorPage, LoginPage, OrganizationPage } from "@/pages";
import ProfilePage from "@/pages/profile/ProfilePage";
import ClientPage from "./pages/ClientPage";
import ClientDetailPage from "@/pages/ClientDetailPage";
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
          path="/profile/:userId"
          element={<ProtectedRoutes component={<ProfilePage />} />} />

          <Route 
              path='/organization/:orgId/clients'
              element={<ProtectedRoutes component={<ClientPage />} />} />
        
          <Route 
              path='/organization/:orgId/clients/:clientId' 
              element={<ProtectedRoutes component={<ClientDetailPage />} />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/error" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
