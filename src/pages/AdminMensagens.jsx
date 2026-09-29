import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../App.css";

function AdminMensagens() {
  const navigate = useNavigate();

  const [mensagens, setMensagens] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [idEditando, setIdEditando] = useState(null);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [assunto, setAssunto] = useState("");
  const [mensagemTexto, setMensagemTexto] = useState("");
  const [status, setStatus] = useState("Nova");

  const [mensagemSistema, setMensagemSistema] = useState("");
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

      buscarMensagens();
    }

    verificarAcesso();
  }, [navigate]);

  async function buscarMensagens() {
    setCarregando(true);

    const { data, error } = await supabase
      .from("mensagens_contato")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar mensagens:", error);
      setCarregando(false);
      return;
    }

    setMensagens(data || []);
    setCarregando(false);
  }

  function limparFormulario() {
    setNome("");
    setEmail("");
    setTelefone("");
    setAssunto("");
    setMensagemTexto("");
    setStatus("Nova");
    setIdEditando(null);
  }

  function abrirNovaMensagem() {
    limparFormulario();
    setMensagemSistema("");
    setMostrarFormulario(true);
  }

  async function cadastrarMensagem(event) {
    event.preventDefault();

    setSalvando(true);
    setMensagemSistema("");

    const { error } = await supabase
      .from("mensagens_contato")
      .insert([
        {
          nome,
          email,
          telefone,
          assunto,
          mensagem: mensagemTexto,
          status,
        },
      ]);

    if (error) {
      console.error("Erro ao cadastrar mensagem:", error);
      setMensagemSistema("Não foi possível cadastrar a mensagem.");
      setSalvando(false);
      return;
    }

    setMensagemSistema("Mensagem cadastrada com sucesso!");

    limparFormulario();
    await buscarMensagens();

    setSalvando(false);
  }

  function editarMensagem(item) {
    setIdEditando(item.id);

    setNome(item.nome || "");
    setEmail(item.email || "");
    setTelefone(item.telefone || "");
    setAssunto(item.assunto || "");
    setMensagemTexto(item.mensagem || "");
    setStatus(item.status || "Nova");

    setMensagemSistema("");
    setMostrarFormulario(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function atualizarMensagem(event) {
    event.preventDefault();

    setSalvando(true);
    setMensagemSistema("");

    const { error } = await supabase
      .from("mensagens_contato")
      .update({
        nome,
        email,
        telefone,
        assunto,
        mensagem: mensagemTexto,
        status,
      })
      .eq("id", idEditando);

    if (error) {
      console.error("Erro ao atualizar mensagem:", error);
      setMensagemSistema("Não foi possível atualizar a mensagem.");
      setSalvando(false);
      return;
    }

    setMensagemSistema("Mensagem atualizada com sucesso!");

    limparFormulario();
    await buscarMensagens();

    setSalvando(false);
  }

  async function excluirMensagem(item) {
    const confirmar = window.confirm(
      `Deseja realmente excluir a mensagem de "${item.nome}"?`
    );

    if (!confirmar) {
      return;
    }

    const { error } = await supabase
      .from("mensagens_contato")
      .delete()
      .eq("id", item.id);

    if (error) {
      console.error("Erro ao excluir mensagem:", error);
      alert("Não foi possível excluir a mensagem.");
      return;
    }

    if (idEditando === item.id) {
      limparFormulario();
      setMostrarFormulario(false);
    }

    await buscarMensagens();
  }

  function formatarData(data) {
    if (!data) return "-";

    return new Date(data).toLocaleString("pt-BR");
  }

  return (
    <div className="admin-pagina">
      <div className="admin-cabecalho">
        <div>
          <span>PAINEL ADMINISTRATIVO</span>

          <h1>Mensagens de Contato</h1>

          <p>
            Visualize e gerencie as mensagens recebidas pelo site.
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
            onClick={abrirNovaMensagem}
          >
            + Nova Mensagem
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setMostrarFormulario(false);
              limparFormulario();
              setMensagemSistema("");
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
              ? atualizarMensagem
              : cadastrarMensagem
          }
        >
          <div className="admin-formulario-titulo">
            <h2>
              {idEditando
                ? "Editar Mensagem"
                : "Nova Mensagem"}
            </h2>
          </div>

          <div className="admin-formulario-grid">
            <div>
              <label>Nome</label>

              <input
                type="text"
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
                value={telefone}
                onChange={(e) =>
                  setTelefone(e.target.value)
                }
              />
            </div>

            <div>
              <label>Assunto</label>

              <input
                type="text"
                value={assunto}
                onChange={(e) =>
                  setAssunto(e.target.value)
                }
              />
            </div>

            <div>
              <label>Status</label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
              >
                <option value="Nova">
                  Nova
                </option>

                <option value="Lida">
                  Lida
                </option>

                <option value="Respondida">
                  Respondida
                </option>

                <option value="Arquivada">
                  Arquivada
                </option>
              </select>
            </div>

            <div className="campo-largo">
              <label>Mensagem</label>

              <textarea
                rows="6"
                value={mensagemTexto}
                onChange={(e) =>
                  setMensagemTexto(e.target.value)
                }
                required
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
              : "Cadastrar Mensagem"}
          </button>

          {mensagemSistema && (
            <p className="admin-mensagem">
              {mensagemSistema}
            </p>
          )}
        </form>
      )}

      {carregando ? (
        <p>Carregando mensagens...</p>
      ) : (
        <div className="admin-tabela-container">
          <table className="admin-tabela">
            <thead>
              <tr>
                <th>Contato</th>
                <th>Assunto</th>
                <th>Mensagem</th>
                <th>Data</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {mensagens.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>
                      {item.nome}
                    </strong>

                    <br />

                    <small>
                      {item.email || item.telefone}
                    </small>
                  </td>

                  <td>
                    {item.assunto || "-"}
                  </td>

                  <td>
                    {item.mensagem}
                  </td>

                  <td>
                    {formatarData(item.created_at)}
                  </td>

                  <td>
                    {item.status}
                  </td>

                  <td>
                    <div className="admin-botoes">
                      <button
                        type="button"
                        className="botao-editar"
                        onClick={() =>
                          editarMensagem(item)
                        }
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        className="botao-excluir"
                        onClick={() =>
                          excluirMensagem(item)
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

          {mensagens.length === 0 && (
            <p className="admin-vazio">
              Nenhuma mensagem recebida.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminMensagens;