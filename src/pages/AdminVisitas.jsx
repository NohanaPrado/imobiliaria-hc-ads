import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../App.css";

function AdminVisitas() {
  const navigate = useNavigate();

  const [visitas, setVisitas] = useState([]);
  const [imoveis, setImoveis] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [idEditando, setIdEditando] = useState(null);

  const [nomeCliente, setNomeCliente] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [imovelId, setImovelId] = useState("");
  const [dataVisita, setDataVisita] = useState("");
  const [horario, setHorario] = useState("");
  const [status, setStatus] = useState("Agendada");
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

      await buscarImoveis();
      await buscarVisitas();
    }

    verificarAcesso();
  }, [navigate]);

  async function buscarImoveis() {
    const { data, error } = await supabase
      .from("imoveis")
      .select("id, titulo")
      .order("titulo", { ascending: true });

    if (error) {
      console.error("Erro ao buscar imóveis:", error);
      return;
    }

    setImoveis(data || []);
  }

  async function buscarVisitas() {
    setCarregando(true);

    const { data, error } = await supabase
      .from("agendamentos_visitas")
      .select("*")
      .order("data_visita", { ascending: true });

    if (error) {
      console.error("Erro ao buscar visitas:", error);
      setCarregando(false);
      return;
    }

    setVisitas(data || []);
    setCarregando(false);
  }

  function limparFormulario() {
    setNomeCliente("");
    setEmail("");
    setTelefone("");
    setImovelId("");
    setDataVisita("");
    setHorario("");
    setStatus("Agendada");
    setObservacoes("");
    setIdEditando(null);
  }

  function abrirNovaVisita() {
    limparFormulario();
    setMensagem("");
    setMostrarFormulario(true);
  }

  async function cadastrarVisita(event) {
    event.preventDefault();

    setSalvando(true);
    setMensagem("");

    const { error } = await supabase
      .from("agendamentos_visitas")
      .insert([
        {
          nome_cliente: nomeCliente,
          email,
          telefone,
          imovel_id: imovelId ? Number(imovelId) : null,
          data_visita: dataVisita,
          horario,
          status,
          observacoes,
        },
      ]);

    if (error) {
      console.error("Erro ao cadastrar visita:", error);
      setMensagem("Não foi possível cadastrar a visita.");
      setSalvando(false);
      return;
    }

    setMensagem("Visita cadastrada com sucesso!");

    limparFormulario();
    await buscarVisitas();

    setSalvando(false);
  }

  function editarVisita(visita) {
    setIdEditando(visita.id);

    setNomeCliente(visita.nome_cliente || "");
    setEmail(visita.email || "");
    setTelefone(visita.telefone || "");
    setImovelId(visita.imovel_id || "");
    setDataVisita(visita.data_visita || "");
    setHorario(visita.horario || "");
    setStatus(visita.status || "Agendada");
    setObservacoes(visita.observacoes || "");

    setMensagem("");
    setMostrarFormulario(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function atualizarVisita(event) {
    event.preventDefault();

    setSalvando(true);
    setMensagem("");

    const { error } = await supabase
      .from("agendamentos_visitas")
      .update({
        nome_cliente: nomeCliente,
        email,
        telefone,
        imovel_id: imovelId ? Number(imovelId) : null,
        data_visita: dataVisita,
        horario,
        status,
        observacoes,
      })
      .eq("id", idEditando);

    if (error) {
      console.error("Erro ao atualizar visita:", error);
      setMensagem("Não foi possível atualizar a visita.");
      setSalvando(false);
      return;
    }

    setMensagem("Visita atualizada com sucesso!");

    limparFormulario();
    await buscarVisitas();

    setSalvando(false);
  }

  async function excluirVisita(visita) {
    const confirmar = window.confirm(
      `Deseja realmente excluir a visita de "${visita.nome_cliente}"?`
    );

    if (!confirmar) {
      return;
    }

    const { error } = await supabase
      .from("agendamentos_visitas")
      .delete()
      .eq("id", visita.id);

    if (error) {
      console.error("Erro ao excluir visita:", error);
      alert("Não foi possível excluir a visita.");
      return;
    }

    if (idEditando === visita.id) {
      limparFormulario();
      setMostrarFormulario(false);
    }

    await buscarVisitas();
  }

  function nomeDoImovel(id) {
    const imovel = imoveis.find(
      (item) => Number(item.id) === Number(id)
    );

    return imovel ? imovel.titulo : "Não informado";
  }

  function formatarData(data) {
    if (!data) return "-";

    const partes = data.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  return (
    <div className="admin-pagina">
      <div className="admin-cabecalho">
        <div>
          <span>PAINEL ADMINISTRATIVO</span>

          <h1>Agendamentos de Visitas</h1>

          <p>
            Cadastre, visualize, edite e exclua visitas aos imóveis.
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
            onClick={abrirNovaVisita}
          >
            + Nova Visita
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
              ? atualizarVisita
              : cadastrarVisita
          }
        >
          <div className="admin-formulario-titulo">
            <h2>
              {idEditando
                ? "Editar Visita"
                : "Nova Visita"}
            </h2>

            <p>
              Preencha as informações do agendamento.
            </p>
          </div>

          <div className="admin-formulario-grid">
            <div>
              <label>Nome do cliente</label>

              <input
                type="text"
                placeholder="Nome completo"
                value={nomeCliente}
                onChange={(e) =>
                  setNomeCliente(e.target.value)
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
              <label>Imóvel</label>

              <select
                value={imovelId}
                onChange={(e) =>
                  setImovelId(e.target.value)
                }
                required
              >
                <option value="">
                  Selecione um imóvel
                </option>

                {imoveis.map((imovel) => (
                  <option
                    key={imovel.id}
                    value={imovel.id}
                  >
                    {imovel.titulo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Data da visita</label>

              <input
                type="date"
                value={dataVisita}
                onChange={(e) =>
                  setDataVisita(e.target.value)
                }
                required
              />
            </div>

            <div>
              <label>Horário</label>

              <input
                type="time"
                value={horario}
                onChange={(e) =>
                  setHorario(e.target.value)
                }
                required
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
                <option value="Agendada">
                  Agendada
                </option>

                <option value="Confirmada">
                  Confirmada
                </option>

                <option value="Realizada">
                  Realizada
                </option>

                <option value="Cancelada">
                  Cancelada
                </option>
              </select>
            </div>

            <div className="campo-largo">
              <label>Observações</label>

              <textarea
                rows="5"
                placeholder="Informações adicionais sobre a visita"
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
              : "Cadastrar Visita"}
          </button>

          {mensagem && (
            <p className="admin-mensagem">
              {mensagem}
            </p>
          )}
        </form>
      )}

      {carregando ? (
        <p>Carregando visitas...</p>
      ) : (
        <div className="admin-tabela-container">
          <table className="admin-tabela">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Imóvel</th>
                <th>Data</th>
                <th>Horário</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {visitas.map((visita) => (
                <tr key={visita.id}>
                  <td>
                    <strong>
                      {visita.nome_cliente}
                    </strong>

                    <br />

                    <small>
                      {visita.telefone}
                    </small>
                  </td>

                  <td>
                    {nomeDoImovel(visita.imovel_id)}
                  </td>

                  <td>
                    {formatarData(visita.data_visita)}
                  </td>

                  <td>
                    {visita.horario || "-"}
                  </td>

                  <td>
                    {visita.status}
                  </td>

                  <td>
                    <div className="admin-botoes">
                      <button
                        type="button"
                        className="botao-editar"
                        onClick={() =>
                          editarVisita(visita)
                        }
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        className="botao-excluir"
                        onClick={() =>
                          excluirVisita(visita)
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

          {visitas.length === 0 && (
            <p className="admin-vazio">
              Nenhuma visita agendada.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminVisitas;