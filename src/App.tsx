import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./components/common/ProtectedRoutes";
import AppProvider from "./providers/AppProvider";
import "./styles/index.css";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ErrorPage from "./pages/ErrorPage";
function App() {


  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<ProtectedRoutes component={<HomePage />} />}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/error" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
