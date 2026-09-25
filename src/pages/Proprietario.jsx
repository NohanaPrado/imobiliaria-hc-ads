import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../App.css";

function Proprietario() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function verificarUsuario() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/login");
        return;
      }

      setUsuario(session.user);
    }

    verificarUsuario();
  }, [navigate]);

  async function sair() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  return (
    <div className="area-usuario">
      <div className="area-usuario-card">
        <h1>Área do Proprietário</h1>

        <p>
          Gerencie e acompanhe seus imóveis.
        </p>

        <p>
          <strong>Usuário:</strong> {usuario?.email}
        </p>

        <div className="area-opcoes">
          <div>
            🏠
            <h3>Meus imóveis</h3>
            <p>Acompanhe seus imóveis cadastrados.</p>
          </div>

          <div>
            ➕
            <h3>Cadastrar imóvel</h3>
            <p>Solicite o cadastro de um novo imóvel.</p>
          </div>

          <div>
            📄
            <h3>Contratos</h3>
            <p>Consulte contratos relacionados aos imóveis.</p>
          </div>

          <div>
            📅
            <h3>Visitas</h3>
            <p>Acompanhe visitas aos seus imóveis.</p>
          </div>
        </div>

        <Link to="/">
          Voltar para o site
        </Link>

        <button onClick={sair}>
          Sair
        </button>
      </div>
    </div>
  );
}

export default Proprietario;