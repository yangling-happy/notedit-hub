import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";
import App from "../App";
import { LoginPage } from "../components/Login";
import { LandingPage } from "../components/marketing/LandingPage";
import { SessionLoading } from "../components/marketing/SessionLoading";
import { useAuth } from "../contexts/authContext";

const RequireAuth = ({ children }: { children: React.ReactElement }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <SessionLoading />;
  if (!user) {
    const from = `${location.pathname}${location.search}`;
    return <Navigate to="/login" replace state={{ from }} />;
  }

  return children;
};

const RedirectIfAuthenticated = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const state = location.state as { from?: string } | null;
  const redirectTo =
    state?.from && state.from.startsWith("/") ? state.from : "/wiki";

  if (isLoading) return <SessionLoading />;
  if (user) return <Navigate to={redirectTo} replace />;

  return children;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RedirectIfAuthenticated>
            <LandingPage />
          </RedirectIfAuthenticated>
        }
      />
      <Route
        path="/login"
        element={
          <RedirectIfAuthenticated>
            <LoginPage />
          </RedirectIfAuthenticated>
        }
      />
      <Route
        path="/wiki"
        element={
          <RequireAuth>
            <App />
          </RequireAuth>
        }
      />
      <Route
        path="/wiki/:docId"
        element={
          <RequireAuth>
            <App />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
