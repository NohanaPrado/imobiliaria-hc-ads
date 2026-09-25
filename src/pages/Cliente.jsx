import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../App.css";

function Cliente() {
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
        <h1>Área do Cliente</h1>

        <p>
          Bem-vindo à HC Imóveis.
        </p>

        <p>
          <strong>Usuário:</strong> {usuario?.email}
        </p>

        <div className="area-opcoes">
          <div>
            ❤️
            <h3>Favoritos</h3>
            <p>Veja seus imóveis favoritos.</p>
          </div>

          <div>
            📅
            <h3>Visitas</h3>
            <p>Acompanhe suas visitas agendadas.</p>
          </div>

          <div>
            💬
            <h3>Propostas</h3>
            <p>Consulte seu histórico de propostas.</p>
          </div>

          <div>
            📄
            <h3>Contratos</h3>
            <p>Consulte seus contratos ativos.</p>
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

export default Cliente;