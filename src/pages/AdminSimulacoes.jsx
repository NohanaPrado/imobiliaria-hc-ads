import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../App.css";

function AdminSimulacoes() {
  const navigate = useNavigate();

  const [simulacoes, setSimulacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [idEditando, setIdEditando] = useState(null);

  const [nomeCliente, setNomeCliente] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [valorImovel, setValorImovel] = useState("");
  const [valorEntrada, setValorEntrada] = useState("");
  const [valorFinanciado, setValorFinanciado] = useState("");
  const [prazoMeses, setPrazoMeses] = useState("");
  const [rendaMensal, setRendaMensal] = useState("");
  const [status, setStatus] = useState("Nova");
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

      buscarSimulacoes();
    }

    verificarAcesso();
  }, [navigate]);

  async function buscarSimulacoes() {
    setCarregando(true);

    const { data, error } = await supabase
      .from("simulacoes_credito")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar simulações:", error);
      setCarregando(false);
      return;
    }

    setSimulacoes(data || []);
    setCarregando(false);
  }

  function limparFormulario() {
    setNomeCliente("");
    setEmail("");
    setTelefone("");
    setValorImovel("");
    setValorEntrada("");
    setValorFinanciado("");
    setPrazoMeses("");
    setRendaMensal("");
    setStatus("Nova");
    setObservacoes("");
    setIdEditando(null);
  }

  function abrirNovaSimulacao() {
    limparFormulario();
    setMensagem("");
    setMostrarFormulario(true);
  }

  function calcularFinanciado(valor, entrada) {
    const imovel = Number(valor || 0);
    const entradaValor = Number(entrada || 0);

    const resultado = imovel - entradaValor;

    setValorFinanciado(
      resultado >= 0 ? String(resultado) : "0"
    );
  }

  async function cadastrarSimulacao(event) {
    event.preventDefault();

    setSalvando(true);
    setMensagem("");

    const { error } = await supabase
      .from("simulacoes_credito")
      .insert([
        {
          nome_cliente: nomeCliente,
          email,
          telefone,
          valor_imovel: Number(valorImovel),
          valor_entrada: Number(valorEntrada || 0),
          valor_financiado: Number(valorFinanciado),
          prazo_meses: Number(prazoMeses || 0),
          renda_mensal: Number(rendaMensal || 0),
          status,
          observacoes,
        },
      ]);

    if (error) {
      console.error("Erro ao cadastrar simulação:", error);
      setMensagem("Não foi possível cadastrar a simulação.");
      setSalvando(false);
      return;
    }

    setMensagem("Simulação cadastrada com sucesso!");

    limparFormulario();
    await buscarSimulacoes();

    setSalvando(false);
  }

  function editarSimulacao(simulacao) {
    setIdEditando(simulacao.id);

    setNomeCliente(simulacao.nome_cliente || "");
    setEmail(simulacao.email || "");
    setTelefone(simulacao.telefone || "");
    setValorImovel(simulacao.valor_imovel || "");
    setValorEntrada(simulacao.valor_entrada || "");
    setValorFinanciado(simulacao.valor_financiado || "");
    setPrazoMeses(simulacao.prazo_meses || "");
    setRendaMensal(simulacao.renda_mensal || "");
    setStatus(simulacao.status || "Nova");
    setObservacoes(simulacao.observacoes || "");

    setMensagem("");
    setMostrarFormulario(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function atualizarSimulacao(event) {
    event.preventDefault();

    setSalvando(true);
    setMensagem("");

    const { error } = await supabase
      .from("simulacoes_credito")
      .update({
        nome_cliente: nomeCliente,
        email,
        telefone,
        valor_imovel: Number(valorImovel),
        valor_entrada: Number(valorEntrada || 0),
        valor_financiado: Number(valorFinanciado),
        prazo_meses: Number(prazoMeses || 0),
        renda_mensal: Number(rendaMensal || 0),
        status,
        observacoes,
      })
      .eq("id", idEditando);

    if (error) {
      console.error("Erro ao atualizar simulação:", error);
      setMensagem("Não foi possível atualizar a simulação.");
      setSalvando(false);
      return;
    }

    setMensagem("Simulação atualizada com sucesso!");

    limparFormulario();
    await buscarSimulacoes();

    setSalvando(false);
  }

  async function excluirSimulacao(simulacao) {
    const confirmar = window.confirm(
      `Deseja realmente excluir a simulação de "${simulacao.nome_cliente}"?`
    );

    if (!confirmar) {
      return;
    }

    const { error } = await supabase
      .from("simulacoes_credito")
      .delete()
      .eq("id", simulacao.id);

    if (error) {
      console.error("Erro ao excluir simulação:", error);
      alert("Não foi possível excluir a simulação.");
      return;
    }

    if (idEditando === simulacao.id) {
      limparFormulario();
      setMostrarFormulario(false);
    }

    await buscarSimulacoes();
  }

  return (
    <div className="admin-pagina">
      <div className="admin-cabecalho">
        <div>
          <span>PAINEL ADMINISTRATIVO</span>

          <h1>Simulações de Crédito</h1>

          <p>
            Cadastre, visualize, edite e exclua simulações de crédito.
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
            onClick={abrirNovaSimulacao}
          >
            + Nova Simulação
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
              ? atualizarSimulacao
              : cadastrarSimulacao
          }
        >
          <div className="admin-formulario-titulo">
            <h2>
              {idEditando
                ? "Editar Simulação"
                : "Nova Simulação"}
            </h2>

            <p>
              Preencha as informações da simulação de crédito.
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
              <label>Valor do imóvel</label>

              <input
                type="number"
                min="0"
                placeholder="Ex: 350000"
                value={valorImovel}
                onChange={(e) => {
                  setValorImovel(e.target.value);
                  calcularFinanciado(
                    e.target.value,
                    valorEntrada
                  );
                }}
                required
              />
            </div>

            <div>
              <label>Valor da entrada</label>

              <input
                type="number"
                min="0"
                placeholder="Ex: 70000"
                value={valorEntrada}
                onChange={(e) => {
                  setValorEntrada(e.target.value);
                  calcularFinanciado(
                    valorImovel,
                    e.target.value
                  );
                }}
              />
            </div>

            <div>
              <label>Valor financiado</label>

              <input
                type="number"
                value={valorFinanciado}
                readOnly
              />
            </div>

            <div>
              <label>Prazo em meses</label>

              <input
                type="number"
                min="1"
                placeholder="Ex: 360"
                value={prazoMeses}
                onChange={(e) =>
                  setPrazoMeses(e.target.value)
                }
              />
            </div>

            <div>
              <label>Renda mensal</label>

              <input
                type="number"
                min="0"
                placeholder="Ex: 6500"
                value={rendaMensal}
                onChange={(e) =>
                  setRendaMensal(e.target.value)
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

                <option value="Em análise">
                  Em análise
                </option>

                <option value="Aprovada">
                  Aprovada
                </option>

                <option value="Reprovada">
                  Reprovada
                </option>

                <option value="Finalizada">
                  Finalizada
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
              : "Cadastrar Simulação"}
          </button>

          {mensagem && (
            <p className="admin-mensagem">
              {mensagem}
            </p>
          )}
        </form>
      )}

      {carregando ? (
        <p>Carregando simulações...</p>
      ) : (
        <div className="admin-tabela-container">
          <table className="admin-tabela">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Imóvel</th>
                <th>Entrada</th>
                <th>Financiado</th>
                <th>Prazo</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {simulacoes.map((simulacao) => (
                <tr key={simulacao.id}>
                  <td>
                    <strong>
                      {simulacao.nome_cliente}
                    </strong>

                    <br />

                    <small>
                      {simulacao.email}
                    </small>
                  </td>

                  <td>
                    R$ {Number(
                      simulacao.valor_imovel || 0
                    ).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </td>

                  <td>
                    R$ {Number(
                      simulacao.valor_entrada || 0
                    ).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </td>

                  <td>
                    R$ {Number(
                      simulacao.valor_financiado || 0
                    ).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </td>

                  <td>
                    {simulacao.prazo_meses || "-"} meses
                  </td>

                  <td>
                    {simulacao.status}
                  </td>

                  <td>
                    <div className="admin-botoes">
                      <button
                        type="button"
                        className="botao-editar"
                        onClick={() =>
                          editarSimulacao(simulacao)
                        }
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        className="botao-excluir"
                        onClick={() =>
                          excluirSimulacao(simulacao)
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

          {simulacoes.length === 0 && (
            <p className="admin-vazio">
              Nenhuma simulação cadastrada.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminSimulacoes;