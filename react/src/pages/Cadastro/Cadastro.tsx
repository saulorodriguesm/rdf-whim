import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import "../Login/Login.css";
import "./Register.css";
import api from "../../api";

const Cadastro = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [gender, setGender] = useState<string>("Feminino");
  const [currentWeight, setCurrentWeight] = useState<string>("");
  const [heightCm, setHeightCm] = useState<string>("");
  const [birthDate, setBirthDate] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginRedirect = () => {
    navigate("/");
  };

  const handleRegister = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setLoading(true);

      const payload = {
        email,
        senha: password,
        nomeCompleto: fullName,
        telefone: phone || null,
        sexo: gender,
        pesoAtual: currentWeight ? parseFloat(currentWeight) : null,
        alturaCm: heightCm ? parseFloat(heightCm) : null,
        dataNascimento: birthDate,
      };

      if (payload.pesoAtual === null || payload.alturaCm === null) {
        setError(
          "Por favor, preencha Peso e Altura com valores numéricos válidos."
        );
        setLoading(false);
        return;
      }

      try {
        await api.post("/auth/register", payload);

        alert(
          "Cadastro realizado com sucesso! Você será redirecionado para o Login."
        );
        navigate("/login");
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error || "Falha na conexão ou erro desconhecido.";
        setError(errorMessage);
        console.error("Registration Error:", errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [
      email,
      password,
      fullName,
      phone,
      gender,
      currentWeight,
      heightCm,
      birthDate,
      navigate,
    ]
  );

  return (
    <div className="login-container register-container">
      <div className="login-image-wrapper">
        <img
          src="../../assets/whim-art-1.png"
          alt="Ritual de Florescimento Art"
          className="login-container-image"
        />
      </div>
      <div className="login-form-container register-form-container">
        <h2 className="login-title">Crie sua Conta</h2>

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleRegister} className="login-form">
          <input
            type="text"
            placeholder="Nome Completo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Senha (mín. 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="login-input"
          />
          <div className="input-group-row">
            <div className="input-field-half">
              <label htmlFor="birthDate" className="login-label">
                Data de Nasc.
              </label>
              <input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
                className="login-input"
              />
            </div>
            <div className="input-field-half">
              <label htmlFor="gender" className="login-label">
                Gênero
              </label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                className="login-input"
              >
                <option value="Feminino">Feminino</option>
                <option value="Feminino">Masculino</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
          </div>
          <div className="input-group-row">
            <div className="input-field-half">
              <input
                type="number"
                placeholder="Peso (kg)"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(e.target.value)}
                required
                step="0.1"
                className="login-input"
              />
            </div>
            <div className="input-field-half">
              <input
                type="number"
                placeholder="Altura (cm)"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                required
                className="login-input"
              />
            </div>
          </div>
          <input
            type="tel"
            placeholder="Telefone (Opcional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="login-input"
          />

          <button type="submit" disabled={loading} className="login-button">
            {loading ? "Cadastrando..." : "Criar Conta"}
          </button>

          <p className="login-link-text">
            Já tem conta?
            <button
              type="button"
              onClick={handleLoginRedirect}
              className="login-link"
            >
              Fazer Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;
