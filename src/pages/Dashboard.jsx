import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../App.css";

function Dashboard() {
  const [usuario, setUsuario] = useState(null);
  const [verificando, setVerificando] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function verificarAcesso() {
      // VERIFICA SE EXISTE USUÁRIO LOGADO
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/login", { replace: true });
        return;
      }

      // BUSCA O TIPO DO USUÁRIO
      const { data: perfil, error } = await supabase
        .from("perfis")
        .select("tipo")
        .eq("id", session.user.id)
        .single();

      if (error || !perfil) {
        console.error("Erro ao verificar perfil:", error);

        await supabase.auth.signOut();

        navigate("/login", { replace: true });
        return;
      }

      // SOMENTE ADMIN PODE ACESSAR O DASHBOARD
      if (perfil.tipo !== "admin") {
        if (perfil.tipo === "cliente") {
          navigate("/cliente", { replace: true });
          return;
        }

        if (perfil.tipo === "proprietario") {
          navigate("/proprietario", { replace: true });
          return;
        }

        navigate("/", { replace: true });
        return;
      }

      setUsuario(session.user);
      setVerificando(false);
    }

    verificarAcesso();
  }, [navigate]);

  async function sair() {
    await supabase.auth.signOut();

    navigate("/login", { replace: true });
  }

  if (verificando) {
    return (
      <div className="pagina-login">
        <div className="login-card">
          <p>Verificando acesso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">

      <aside className="dashboard-menu">

        <div className="dashboard-logo">
          HC <span>Imóveis</span>
        </div>

        <p className="dashboard-usuario">
          {usuario?.email}
        </p>

        <nav>
          <a href="#inicio">
            📊 Início
          </a>

          <a href="#imoveis">
            🏠 Imóveis
          </a>

          <a href="#proprietarios">
            👤 Proprietários
          </a>

          <a href="#clientes">
            👥 Clientes
          </a>

          <a href="#contratos">
            📄 Contratos
          </a>

          <a href="#visitas">
            📅 Visitas
          </a>

          <a href="#propostas">
            💬 Propostas
          </a>
        </nav>

        <Link
          to="/"
          className="dashboard-site"
        >
          🌐 Ver site
        </Link>

        <button
          className="dashboard-sair"
          onClick={sair}
        >
          Sair
        </button>

      </aside>

      <main
        className="dashboard-conteudo"
        id="inicio"
      >

        <div className="dashboard-topo">

          <div>
            <span>
              PAINEL ADMINISTRATIVO
            </span>

            <h1>
              Dashboard
            </h1>

            <p>
              Gerencie as informações da HC Imóveis.
            </p>
          </div>

        </div>

        <div className="dashboard-cards">

          <div className="dashboard-card">
            <span>🏠</span>

            <h3>Imóveis</h3>

            <p>
              Cadastrar, editar e acompanhar imóveis.
            </p>
          </div>

          <div className="dashboard-card">
            <span>👥</span>

            <h3>Clientes</h3>

            <p>
              Gerenciar inquilinos e compradores.
            </p>
          </div>

          <div className="dashboard-card">
            <span>📄</span>

            <h3>Contratos</h3>

            <p>
              Consultar contratos e vencimentos.
            </p>
          </div>

          <div className="dashboard-card">
            <span>📅</span>

            <h3>Visitas</h3>

            <p>
              Acompanhar visitas agendadas.
            </p>
          </div>

          <div className="dashboard-card">
            <span>💬</span>

            <h3>Propostas</h3>

            <p>
              Visualizar mensagens recebidas.
            </p>
          </div>

          <div className="dashboard-card">
            <span>👤</span>

            <h3>Proprietários</h3>

            <p>
              Gerenciar proprietários cadastrados.
            </p>
          </div>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;