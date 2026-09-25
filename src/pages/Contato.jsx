import { Link } from "react-router-dom";
import "../App.css";

function Contato() {
  return (
    <div className="pagina-contato">
      <header className="contato-header">
        <div className="container menu">
          <div className="logo">
            HC <span>Imóveis</span>
          </div>

          <nav>
            <Link to="/">Início</Link>
            <Link to="/login">Entrar</Link>
          </nav>
        </div>
      </header>

      <main className="contato-pagina-conteudo">
        <div className="contato-pagina-texto">
          <span>FALE CONOSCO</span>

          <h1>Como podemos ajudar?</h1>

          <p>
            Entre em contato com a equipe da HC Imóveis.
          </p>

          <div className="contato-info">
            <p>📞 <strong>(41) 99228-6652</strong></p>
            <p>✉️ <strong>contato.hcimoveis@gmail.com</strong></p>
            <p>📍 Curitiba - Paraná</p>
          </div>

          <Link to="/" className="voltar-inicio">
            ← Voltar para a página inicial
          </Link>
        </div>

        <div className="formulario-pagina-contato">
          <h2>Envie uma mensagem</h2>

          <input
            type="text"
            placeholder="Digite seu nome"
          />

          <input
            type="email"
            placeholder="Digite seu e-mail"
          />

          <input
            type="text"
            placeholder="Digite seu telefone"
          />

          <textarea
            placeholder="Como podemos ajudar?"
            rows="5"
          />

          <button type="button">
            Enviar mensagem
          </button>
        </div>
      </main>
    </div>
  );
}

export default Contato;