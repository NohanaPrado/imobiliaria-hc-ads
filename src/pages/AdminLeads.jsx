import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../App.css";

function AdminLeads() {
  const navigate = useNavigate();

  const [leads, setLeads] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [idEditando, setIdEditando] = useState(null);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [interesse, setInteresse] = useState("");
  const [origem, setOrigem] = useState("Site");
  const [status, setStatus] = useState("Novo");
  const [observacoes, setObservacoes] = useState("");

  const [mensagem, setMensagem] = useState("");
  const [salvando, setSalvando] = useState(false);

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

      buscarLeads();
    }

    verificarAcesso();
  }, [navigate]);

  async function buscarLeads() {
    setCarregando(true);

    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar leads:", error);
      setCarregando(false);
      return;
    }

    setLeads(data || []);
    setCarregando(false);
  }

  function limparFormulario() {
    setNome("");
    setEmail("");
    setTelefone("");
    setInteresse("");
    setOrigem("Site");
    setStatus("Novo");
    setObservacoes("");
    setIdEditando(null);
  }

  function abrirNovoLead() {
    limparFormulario();
    setMensagem("");
    setMostrarFormulario(true);
  }

  async function cadastrarLead(event) {
    event.preventDefault();

    setSalvando(true);
    setMensagem("");

    const { error } = await supabase
      .from("leads")
      .insert([
        {
          nome,
          email,
          telefone,
          interesse,
          origem,
          status,
          observacoes,
        },
      ]);

    if (error) {
      console.error("Erro ao cadastrar lead:", error);
      setMensagem("Não foi possível cadastrar o lead.");
      setSalvando(false);
      return;
    }

    setMensagem("Lead cadastrado com sucesso!");

    limparFormulario();
    await buscarLeads();

    setSalvando(false);
  }

  function editarLead(lead) {
    setIdEditando(lead.id);

    setNome(lead.nome || "");
    setEmail(lead.email || "");
    setTelefone(lead.telefone || "");
    setInteresse(lead.interesse || "");
    setOrigem(lead.origem || "Site");
    setStatus(lead.status || "Novo");
    setObservacoes(lead.observacoes || "");

    setMensagem("");
    setMostrarFormulario(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function atualizarLead(event) {
    event.preventDefault();

    setSalvando(true);
    setMensagem("");

    const { error } = await supabase
      .from("leads")
      .update({
        nome,
        email,
        telefone,
        interesse,
        origem,
        status,
        observacoes,
      })
      .eq("id", idEditando);

    if (error) {
      console.error("Erro ao atualizar lead:", error);
      setMensagem("Não foi possível atualizar o lead.");
      setSalvando(false);
      return;
    }

    setMensagem("Lead atualizado com sucesso!");

    limparFormulario();
    await buscarLeads();

    setSalvando(false);
  }

  async function excluirLead(lead) {
    const confirmar = window.confirm(
      `Deseja realmente excluir o lead "${lead.nome}"?`
    );

    if (!confirmar) {
      return;
    }

    const { error } = await supabase
      .from("leads")
      .delete()
      .eq("id", lead.id);

    if (error) {
      console.error("Erro ao excluir lead:", error);
      alert("Não foi possível excluir o lead.");
      return;
    }

    if (idEditando === lead.id) {
      limparFormulario();
      setMostrarFormulario(false);
    }

    await buscarLeads();
  }

  return (
    <div className="admin-pagina">

      <div className="admin-cabecalho">
        <div>
          <span>PAINEL ADMINISTRATIVO</span>

          <h1>Gerenciar Leads</h1>

          <p>
            Cadastre, visualize, edite e exclua os contatos interessados.
          </p>
        </div>

        <Link
          to="/dashboard"
          className="admin-voltar"
        >
          ← Voltar ao Dashboard
        </Link>
      </div>

      <div className="admin-acoes">
        {!mostrarFormulario ? (
          <button
            type="button"
            onClick={abrirNovoLead}
          >
            + Novo Lead
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setMostrarFormulario(false);
              limparFormulario();
              setMensagem("");
            }}
          >
            Fechar formulário
          </button>
        )}
      </div>

      {mostrarFormulario && (
        <form
          className="admin-formulario"
          onSubmit={
            idEditando
              ? atualizarLead
              : cadastrarLead
          }
        >
          <div className="admin-formulario-titulo">
            <h2>
              {idEditando
                ? "Editar Lead"
                : "Novo Lead"}
            </h2>

            <p>
              Preencha as informações do contato.
            </p>
          </div>

          <div className="admin-formulario-grid">

            <div>
              <label>Nome</label>

              <input
                type="text"
                placeholder="Nome completo"
                value={nome}
                onChange={(e) =>
                  setNome(e.target.value)
                }
                required
              />
            </div>

            <div>
              <label>E-mail</label>

              <input
                type="email"
                placeholder="email@exemplo.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </div>

            <div>
              <label>Telefone</label>

              <input
                type="text"
                placeholder="(41) 99999-9999"
                value={telefone}
                onChange={(e) =>
                  setTelefone(e.target.value)
                }
              />
            </div>

            <div>
              <label>Interesse</label>

              <input
                type="text"
                placeholder="Ex: Apartamento no Centro"
                value={interesse}
                onChange={(e) =>
                  setInteresse(e.target.value)
                }
              />
            </div>

            <div>
              <label>Origem</label>

              <select
                value={origem}
                onChange={(e) =>
                  setOrigem(e.target.value)
                }
              >
                <option value="Site">
                  Site
                </option>

                <option value="WhatsApp">
                  WhatsApp
                </option>

                <option value="Instagram">
                  Instagram
                </option>

                <option value="Facebook">
                  Facebook
                </option>

                <option value="Indicação">
                  Indicação
                </option>
              </select>
            </div>

            <div>
              <label>Status</label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
              >
                <option value="Novo">
                  Novo
                </option>

                <option value="Em atendimento">
                  Em atendimento
                </option>

                <option value="Interessado">
                  Interessado
                </option>

                <option value="Convertido">
                  Convertido
                </option>

                <option value="Perdido">
                  Perdido
                </option>
              </select>
            </div>

            <div className="campo-largo">
              <label>Observações</label>

              <textarea
                rows="5"
                placeholder="Informações adicionais sobre o lead"
                value={observacoes}
                onChange={(e) =>
                  setObservacoes(e.target.value)
                }
              />
            </div>

          </div>

          <button
            className="admin-salvar"
            type="submit"
            disabled={salvando}
          >
            {salvando
              ? "Salvando..."
              : idEditando
              ? "Salvar alterações"
              : "Cadastrar Lead"}
          </button>

          {mensagem && (
            <p className="admin-mensagem">
              {mensagem}
            </p>
          )}
        </form>
      )}

      {carregando ? (
        <p>Carregando leads...</p>
      ) : (
        <div className="admin-tabela-container">

          <table className="admin-tabela">

            <thead>
              <tr>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Interesse</th>
                <th>Origem</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>

                  <td>
                    <strong>
                      {lead.nome}
                    </strong>

                    <br />

                    <small>
                      {lead.email}
                    </small>
                  </td>

                  <td>
                    {lead.telefone || "-"}
                  </td>

                  <td>
                    {lead.interesse || "-"}
                  </td>

                  <td>
                    {lead.origem || "-"}
                  </td>

                  <td>
                    {lead.status}
                  </td>

                  <td>
                    <div className="admin-botoes">

                      <button
                        type="button"
                        className="botao-editar"
                        onClick={() =>
                          editarLead(lead)
                        }
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        className="botao-excluir"
                        onClick={() =>
                          excluirLead(lead)
                        }
                      >
                        Excluir
                      </button>

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

          {leads.length === 0 && (
            <p className="admin-vazio">
              Nenhum lead cadastrado.
            </p>
          )}

        </div>
      )}
    </div>
  );
}

export default AdminLeads;