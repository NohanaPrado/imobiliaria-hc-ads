import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../App.css";

function AdminCorretores() {
  const navigate = useNavigate();

  const [corretores, setCorretores] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [idEditando, setIdEditando] = useState(null);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [creci, setCreci] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [status, setStatus] = useState("Ativo");
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

      buscarCorretores();
    }

    verificarAcesso();
  }, [navigate]);

  async function buscarCorretores() {
    setCarregando(true);

    const { data, error } = await supabase
      .from("corretores")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar corretores:", error);
      setCarregando(false);
      return;
    }

    setCorretores(data || []);
    setCarregando(false);
  }

  function limparFormulario() {
    setNome("");
    setEmail("");
    setTelefone("");
    setCreci("");
    setEspecialidade("");
    setStatus("Ativo");
    setObservacoes("");
    setIdEditando(null);
  }

  function abrirNovoCorretor() {
    limparFormulario();
    setMensagem("");
    setMostrarFormulario(true);
  }

  async function cadastrarCorretor(event) {
    event.preventDefault();

    setSalvando(true);
    setMensagem("");

    const { error } = await supabase
      .from("corretores")
      .insert([
        {
          nome,
          email,
          telefone,
          creci,
          especialidade,
          status,
          observacoes,
        },
      ]);

    if (error) {
      console.error("Erro ao cadastrar corretor:", error);
      setMensagem("Não foi possível cadastrar o corretor.");
      setSalvando(false);
      return;
    }

    setMensagem("Corretor cadastrado com sucesso!");

    limparFormulario();
    await buscarCorretores();

    setSalvando(false);
  }

  function editarCorretor(corretor) {
    setIdEditando(corretor.id);

    setNome(corretor.nome || "");
    setEmail(corretor.email || "");
    setTelefone(corretor.telefone || "");
    setCreci(corretor.creci || "");
    setEspecialidade(corretor.especialidade || "");
    setStatus(corretor.status || "Ativo");
    setObservacoes(corretor.observacoes || "");

    setMensagem("");
    setMostrarFormulario(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function atualizarCorretor(event) {
    event.preventDefault();

    setSalvando(true);
    setMensagem("");

    const { error } = await supabase
      .from("corretores")
      .update({
        nome,
        email,
        telefone,
        creci,
        especialidade,
        status,
        observacoes,
      })
      .eq("id", idEditando);

    if (error) {
      console.error("Erro ao atualizar corretor:", error);
      setMensagem("Não foi possível atualizar o corretor.");
      setSalvando(false);
      return;
    }

    setMensagem("Corretor atualizado com sucesso!");

    limparFormulario();
    await buscarCorretores();

    setSalvando(false);
  }

  async function excluirCorretor(corretor) {
    const confirmar = window.confirm(
      `Deseja realmente excluir o corretor "${corretor.nome}"?`
    );

    if (!confirmar) {
      return;
    }

    const { error } = await supabase
      .from("corretores")
      .delete()
      .eq("id", corretor.id);

    if (error) {
      console.error("Erro ao excluir corretor:", error);
      alert("Não foi possível excluir o corretor.");
      return;
    }

    if (idEditando === corretor.id) {
      limparFormulario();
      setMostrarFormulario(false);
    }

    await buscarCorretores();
  }

  return (
    <div className="admin-pagina">

      <div className="admin-cabecalho">
        <div>
          <span>PAINEL ADMINISTRATIVO</span>

          <h1>Gerenciar Corretores</h1>

          <p>
            Cadastre, visualize, edite e exclua corretores da imobiliária.
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
            onClick={abrirNovoCorretor}
          >
            + Novo Corretor
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
              ? atualizarCorretor
              : cadastrarCorretor
          }
        >
          <div className="admin-formulario-titulo">
            <h2>
              {idEditando
                ? "Editar Corretor"
                : "Novo Corretor"}
            </h2>

            <p>
              Preencha as informações do corretor.
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
              <label>CRECI</label>

              <input
                type="text"
                placeholder="Ex: CRECI 12345"
                value={creci}
                onChange={(e) =>
                  setCreci(e.target.value)
                }
                required
              />
            </div>

            <div>
              <label>Especialidade</label>

              <select
                value={especialidade}
                onChange={(e) =>
                  setEspecialidade(e.target.value)
                }
              >
                <option value="">
                  Selecione
                </option>

                <option value="Locação">
                  Locação
                </option>

                <option value="Venda">
                  Venda
                </option>

                <option value="Lançamentos">
                  Lançamentos
                </option>

                <option value="Comercial">
                  Comercial
                </option>

                <option value="Residencial">
                  Residencial
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
                <option value="Ativo">
                  Ativo
                </option>

                <option value="Inativo">
                  Inativo
                </option>

                <option value="Férias">
                  Férias
                </option>
              </select>
            </div>

            <div className="campo-largo">
              <label>Observações</label>

              <textarea
                rows="5"
                placeholder="Informações adicionais"
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
              : "Cadastrar Corretor"}
          </button>

          {mensagem && (
            <p className="admin-mensagem">
              {mensagem}
            </p>
          )}
        </form>
      )}

      {carregando ? (
        <p>Carregando corretores...</p>
      ) : (
        <div className="admin-tabela-container">

          <table className="admin-tabela">

            <thead>
              <tr>
                <th>Corretor</th>
                <th>Telefone</th>
                <th>CRECI</th>
                <th>Especialidade</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {corretores.map((corretor) => (
                <tr key={corretor.id}>

                  <td>
                    <strong>
                      {corretor.nome}
                    </strong>

                    <br />

                    <small>
                      {corretor.email}
                    </small>
                  </td>

                  <td>
                    {corretor.telefone || "-"}
                  </td>

                  <td>
                    {corretor.creci}
                  </td>

                  <td>
                    {corretor.especialidade || "-"}
                  </td>

                  <td>
                    {corretor.status}
                  </td>

                  <td>
                    <div className="admin-botoes">

                      <button
                        type="button"
                        className="botao-editar"
                        onClick={() =>
                          editarCorretor(corretor)
                        }
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        className="botao-excluir"
                        onClick={() =>
                          excluirCorretor(corretor)
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

          {corretores.length === 0 && (
            <p className="admin-vazio">
              Nenhum corretor cadastrado.
            </p>
          )}

        </div>
      )}

    </div>
  );
}

export default AdminCorretores;