import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/Login/Login";
import RegisterPage from "./pages/Register/Register";
import QuestionarioPage from "./pages/Survey/QuestionarioPage";

import Header from "./components/Header/Header";
const isAuthenticated = () => !!localStorage.getItem("token");

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
};

const PublicRoute: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  return isAuthenticated() ? <Navigate to="/questionario" replace /> : children;
};

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              <Navigate to="/questionario" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/cadastro"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        <Route
          path="/questionario"
          element={
            <PrivateRoute>
              <QuestionarioPage />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
