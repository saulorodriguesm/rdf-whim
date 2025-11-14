import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const isLoggedIn = !!localStorage.getItem("token");

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="header-container">
      <header className="header">
        <img
          className="header-logo"
          src="../../assets/icon.ico"
          alt="WHIM Logo"
        />

        {/* Botão Hamburguer */}

        <button
          className="hamburger-btn"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        {/* Menu */}
        {open && (
          <div className="menu-dropdown">
            <button onClick={() => navigate("/resultados")}>
              Resultados (em breve)
            </button>

            <button onClick={handleLogout}>Sair</button>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;
