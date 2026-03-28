import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import App from "../App";
import { LoginPage } from "../components/Login";
import { useAuth } from "../contexts/authContext";

const RequireAuth = ({ children }: { children: React.ReactElement }) => {
  const { user, isLoading } = useAuth();
  const { t } = useTranslation();

  if (isLoading) return <div>{t("common.loading")}</div>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

const RedirectIfAuthenticated = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const { user, isLoading } = useAuth();
  const { t } = useTranslation();

  if (isLoading) return <div>{t("common.loading")}</div>;
  if (user) return <Navigate to="/wiki" replace />;

  return children;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
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
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
