import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import "./Login.css";
import api from "../../api";

const LoginPage = () => {
  const [mail, setMail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    navigate("/cadastro");
  };

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();
      setError(null);
      setLoading(true);
      try {
        const response = await api.post("/auth/login", { mail, password });
        const { token, paciente } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("pacienteData", JSON.stringify(paciente));
        alert(`Bem-vinda, ${paciente.nome}! Login realizado com sucesso.`);
        console.log("Login OK. Redirecionando...");
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "Falha na conexão ou erro desconhecido.";
        setError(errorMessage);
        console.error("Erro de Login:", errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [mail, password]
  );

  return (
    <div className="login-container">
      <img className="whim-logo" src="../../assets/logo.png" />
      <div className="login-image-wrapper">
        <img
          src="../../assets/whim-art-1.png"
          alt="Ritual de Florescimento Logo"
          className="login-container-image"
        />
      </div>
      <div className="login-form-container">
        {" "}
        <h2 className="login-title">Ritual de Florescimento</h2>
        {error && <p className="login-error">{error}</p>}
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Digite seu email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />

          <button type="submit" disabled={loading} className="login-button">
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <p className="login-link-text">
            ou
            <button
              type="button"
              onClick={handleCreateAccount}
              className="login-link"
            >
              Crie sua conta
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
