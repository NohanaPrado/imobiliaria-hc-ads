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
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/login", { replace: true });
        return;
      }

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

          <Link to="/dashboard/imoveis">
            🏠 Imóveis
          </Link>

          <Link to="/dashboard/leads">
            👥 Leads
          </Link>

          <Link to="/dashboard/simulacoes">
            💰 Simulações de crédito
          </Link>

          <Link to="/dashboard/corretores">
            🧑‍💼 Corretores
          </Link>

          <Link to="/dashboard/visitas">
            📅 Agendamentos
          </Link>

          <Link to="/dashboard/mensagens">
            ✉️ Mensagens
          </Link>
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

          <Link
            to="/dashboard/imoveis"
            className="dashboard-card"
          >
            <span>🏠</span>

            <h3>Imóveis</h3>

            <p>
              Cadastrar, visualizar, editar e excluir imóveis.
            </p>
          </Link>

          <Link
            to="/dashboard/leads"
            className="dashboard-card"
          >
            <span>👥</span>

            <h3>Leads</h3>

            <p>
              Gerenciar pessoas interessadas nos imóveis.
            </p>
          </Link>

          <Link
            to="/dashboard/simulacoes"
            className="dashboard-card"
          >
            <span>💰</span>

            <h3>Simulações de Crédito</h3>

            <p>
              Cadastrar e acompanhar simulações de financiamento.
            </p>
          </Link>

          <Link
            to="/dashboard/corretores"
            className="dashboard-card"
          >
            <span>🧑‍💼</span>

            <h3>Corretores</h3>

            <p>
              Cadastrar e gerenciar os corretores da imobiliária.
            </p>
          </Link>

          <Link
            to="/dashboard/visitas"
            className="dashboard-card"
          >
            <span>📅</span>

            <h3>Agendamentos de Visitas</h3>

            <p>
              Consultar e gerenciar visitas aos imóveis.
            </p>
          </Link>

          <Link
            to="/dashboard/mensagens"
            className="dashboard-card"
          >
            <span>✉️</span>

            <h3>Mensagens Recebidas</h3>

            <p>
              Visualizar mensagens enviadas pelo formulário do site.
            </p>
          </Link>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;