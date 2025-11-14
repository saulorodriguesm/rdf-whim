import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login/Login";
import Cadastro from "./pages/Cadastro/Cadastro";
import Questionario from "./pages/Questionario/Questionario";

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
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/cadastro"
          element={
            <PublicRoute>
              <Cadastro />
            </PublicRoute>
          }
        />

        <Route
          path="/questionario"
          element={
            <PrivateRoute>
              <Questionario />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
