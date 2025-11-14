import React, { useEffect, useState, useCallback, useMemo } from "react";
import api from "../../api";
import "./Questionario.css";

interface Pergunta {
  id: number;
  textoPergunta: string;
  ordem: number;
  ehInvertida: boolean;
  pilarNome: string;
}

interface Pilar {
  id: number;
  nomePilar: string;
  pontuacaoMaxima: number;
  perguntas: Pergunta[];
}

type AnswersState = Record<number, number>;

const Questionario: React.FC = () => {
  const [pilaresData, setPilaresData] = useState<Pilar[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<AnswersState>({});

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const allQuestions: Pergunta[] = useMemo(() => {
    return pilaresData.flatMap((pilar) =>
      pilar.perguntas.map((pergunta) => ({
        ...pergunta,
        pilarNome: pilar.nomePilar,
      }))
    );
  }, [pilaresData]);

  const totalQuestions = allQuestions.length;
  const currentQuestion = allQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  useEffect(() => {
    const fetchEstrutura = async () => {
      try {
        const response = await api.get("/questionario/estrutura");
        setPilaresData(response.data);
      } catch (err: any) {
        setError(
          "Falha ao carregar o questionário. Tente fazer login novamente."
        );
        console.error("Erro ao buscar estrutura:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEstrutura();
  }, []);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setTimeout(() => {
        setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
      }, 100);
    }
  }, [currentQuestionIndex]);

  const handleNext = useCallback(() => {
    if (answers[currentQuestion.id] !== undefined && !isLastQuestion) {
      setTimeout(() => {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      }, 100);
    }
  }, [answers, currentQuestion, isLastQuestion]);

  const handleAnswerChange = useCallback(
    (perguntaId: number, score: number) => {
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [perguntaId]: score,
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      if (Object.keys(answers).length !== totalQuestions) {
        setError("Erro interno: Nem todas as perguntas foram respondidas.");
        setLoading(false);
        return;
      }

      setError(null);

      console.log("Respostas Prontas para Enviar:", answers);
      alert("Questionário pronto para envio! (Verifique o console)");

      // TODO: Implementar a chamada real para a API

      setLoading(false);
    },
    [answers, totalQuestions]
  );

  if (loading && totalQuestions === 0) {
    return <div className="loading-container">Carregando questionário...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (totalQuestions === 0) {
    return (
      <div className="loading-container">Nenhuma pergunta encontrada.</div>
    );
  }

  const progressPercentage =
    ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const isCurrentAnswered = answers[currentQuestion.id] !== undefined;

  return (
    <div className="login-container questionario-wrapper">
      <div className="login-image-wrapper">
        <img
          src="../../assets/whim-art-1.png"
          alt="Ritual de Florescimento Art"
          className="login-container-image"
        />
      </div>

      <div className="login-form-container questionario-form-container">
        <h1 className="login-title">Ritual de Florescimento WHIM</h1>

        <p className="questionario-subtitle">
          Progresso: {currentQuestionIndex + 1} de {totalQuestions}
        </p>

        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {currentQuestion && (
            <section key={currentQuestion.id} className="pergunta-card">
              <h2 className="pilar-title">{currentQuestion.pilarNome}</h2>

              <p className="pergunta-texto">
                {currentQuestion.ordem}. {currentQuestion.textoPergunta}
              </p>

              <div className="options-group">
                {[1, 2, 3].map((score) => (
                  <label key={score}>
                    <input
                      type="radio"
                      name={`pergunta_${currentQuestion.id}`}
                      value={score}
                      checked={answers[currentQuestion.id] === score}
                      onChange={() =>
                        handleAnswerChange(currentQuestion.id, score)
                      }
                      required
                    />
                    <span>
                      {score === 1 && "Nunca"}
                      {score === 2 && "Às vezes"}
                      {score === 3 && "Frequentemente"}
                    </span>
                  </label>
                ))}
              </div>
            </section>
          )}

          <div className="navigation-controls">
            {currentQuestionIndex > 0 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="login-button nav-button"
              >
                ← Voltar
              </button>
            )}

            {isLastQuestion ? (
              <button
                type="submit"
                className="login-button"
                disabled={!isCurrentAnswered}
              >
                Finalizar Questionário
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="login-button"
                disabled={!isCurrentAnswered}
              >
                Próximo →
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Questionario;
