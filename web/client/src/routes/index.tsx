import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import App from "../App";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/wiki" replace />} />
      <Route path="/wiki" element={<App />} />
      <Route path="/wiki/:docId" element={<App />} />
      <Route path="*" element={<Navigate to="/wiki" replace />} />
    </Routes>
  );
};

export default AppRoutes;
