import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../App.css";

function AdminImoveis() {
  const navigate = useNavigate();

  // =========================
  // IMÓVEIS
  // =========================

  const [imoveis, setImoveis] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // =========================
  // FORMULÁRIO
  // =========================

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [idEditando, setIdEditando] = useState(null);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipoImovel, setTipoImovel] = useState("Apartamento");
  const [tipoNegocio, setTipoNegocio] = useState("Aluguel");
  const [preco, setPreco] = useState("");
  const [condominio, setCondominio] = useState("");
  const [endereco, setEndereco] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("Curitiba");
  const [quartos, setQuartos] = useState("");
  const [banheiros, setBanheiros] = useState("");
  const [area, setArea] = useState("");
  const [status, setStatus] = useState("Disponível");
  const [imagemUrl, setImagemUrl] = useState("");

  const [mensagem, setMensagem] = useState("");
  const [salvando, setSalvando] = useState(false);

  // =========================
  // VERIFICAR ADMIN
  // =========================

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

      buscarImoveis();
    }

    verificarAcesso();
  }, [navigate]);

  // =========================
  // BUSCAR IMÓVEIS
  // READ
  // =========================

  async function buscarImoveis() {
    setCarregando(true);

    const { data, error } = await supabase
      .from("imoveis")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Erro ao buscar imóveis:", error);
      setCarregando(false);
      return;
    }

    setImoveis(data || []);
    setCarregando(false);
  }

  // =========================
  // LIMPAR FORMULÁRIO
  // =========================

  function limparFormulario() {
    setTitulo("");
    setDescricao("");
    setTipoImovel("Apartamento");
    setTipoNegocio("Aluguel");
    setPreco("");
    setCondominio("");
    setEndereco("");
    setBairro("");
    setCidade("Curitiba");
    setQuartos("");
    setBanheiros("");
    setArea("");
    setStatus("Disponível");
    setImagemUrl("");
    setIdEditando(null);
  }

  // =========================
  // ABRIR NOVO CADASTRO
  // =========================

  function abrirNovoFormulario() {
    limparFormulario();
    setMensagem("");
    setMostrarFormulario(true);
  }

  // =========================
  // CADASTRAR
  // CREATE
  // =========================

  async function cadastrarImovel(event) {
    event.preventDefault();

    setSalvando(true);
    setMensagem("");

    const { error } = await supabase
      .from("imoveis")
      .insert([
        {
          titulo: titulo,
          descricao: descricao,
          tipo_imovel: tipoImovel,
          tipo_negocio: tipoNegocio,
          preco: Number(preco),

          condominio:
            condominio === ""
              ? 0
              : Number(condominio),

          endereco: endereco,
          bairro: bairro,
          cidade: cidade,
          quartos: Number(quartos),
          banheiros: Number(banheiros),
          area: Number(area),
          status: status,
          imagem_url: imagemUrl,
        },
      ]);

    if (error) {
      console.error("Erro ao cadastrar imóvel:", error);

      setMensagem(
        "Não foi possível cadastrar o imóvel."
      );

      setSalvando(false);
      return;
    }

    setMensagem(
      "Imóvel cadastrado com sucesso!"
    );

    limparFormulario();

    await buscarImoveis();

    setSalvando(false);
  }

  // =========================
  // CARREGAR IMÓVEL PARA EDITAR
  // =========================

  function editarImovel(imovel) {
    setIdEditando(imovel.id);

    setTitulo(imovel.titulo || "");
    setDescricao(imovel.descricao || "");
    setTipoImovel(
      imovel.tipo_imovel || "Apartamento"
    );

    setTipoNegocio(
      imovel.tipo_negocio || "Aluguel"
    );

    setPreco(imovel.preco || "");
    setCondominio(imovel.condominio || "");
    setEndereco(imovel.endereco || "");
    setBairro(imovel.bairro || "");
    setCidade(imovel.cidade || "");
    setQuartos(imovel.quartos || "");
    setBanheiros(imovel.banheiros || "");
    setArea(imovel.area || "");
    setStatus(imovel.status || "Disponível");
    setImagemUrl(imovel.imagem_url || "");

    setMensagem("");
    setMostrarFormulario(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // =========================
  // ATUALIZAR
  // UPDATE
  // =========================

  async function atualizarImovel(event) {
    event.preventDefault();

    setSalvando(true);
    setMensagem("");

    const { error } = await supabase
      .from("imoveis")
      .update({
        titulo: titulo,
        descricao: descricao,
        tipo_imovel: tipoImovel,
        tipo_negocio: tipoNegocio,
        preco: Number(preco),

        condominio:
          condominio === ""
            ? 0
            : Number(condominio),

        endereco: endereco,
        bairro: bairro,
        cidade: cidade,
        quartos: Number(quartos),
        banheiros: Number(banheiros),
        area: Number(area),
        status: status,
        imagem_url: imagemUrl,
      })
      .eq("id", idEditando);

    if (error) {
      console.error(
        "Erro ao atualizar imóvel:",
        error
      );

      setMensagem(
        "Não foi possível atualizar o imóvel."
      );

      setSalvando(false);
      return;
    }

    setMensagem(
      "Imóvel atualizado com sucesso!"
    );

    limparFormulario();

    await buscarImoveis();

    setSalvando(false);
  }

  // =========================
  // EXCLUIR
  // DELETE
  // =========================

  async function excluirImovel(imovel) {
    const confirmar = window.confirm(
      `Deseja realmente excluir "${imovel.titulo}"?`
    );

    if (!confirmar) {
      return;
    }

    const { error } = await supabase
      .from("imoveis")
      .delete()
      .eq("id", imovel.id);

    if (error) {
      console.error(
        "Erro ao excluir imóvel:",
        error
      );

      alert(
        "Não foi possível excluir o imóvel."
      );

      return;
    }

    if (idEditando === imovel.id) {
      limparFormulario();
      setMostrarFormulario(false);
    }

    await buscarImoveis();
  }

  // =========================
  // TELA
  // =========================

  return (
    <div className="admin-pagina">

      {/* CABEÇALHO */}

      <div className="admin-cabecalho">

        <div>
          <span>
            PAINEL ADMINISTRATIVO
          </span>

          <h1>
            Gerenciar Imóveis
          </h1>

          <p>
            Cadastre, visualize, edite e exclua
            os imóveis da HC Imóveis.
          </p>
        </div>

        <Link
          to="/dashboard"
          className="admin-voltar"
        >
          ← Voltar ao Dashboard
        </Link>

      </div>

      {/* BOTÃO NOVO IMÓVEL */}

      <div className="admin-acoes">

        {!mostrarFormulario ? (
          <button
            type="button"
            onClick={abrirNovoFormulario}
          >
            + Cadastrar imóvel
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

      {/* FORMULÁRIO */}

      {mostrarFormulario && (
        <form
          className="admin-formulario"
          onSubmit={
            idEditando
              ? atualizarImovel
              : cadastrarImovel
          }
        >

          <div className="admin-formulario-titulo">

            <h2>
              {idEditando
                ? "Editar imóvel"
                : "Novo imóvel"}
            </h2>

            <p>
              {idEditando
                ? "Altere as informações do imóvel."
                : "Preencha as informações para cadastrar um imóvel."}
            </p>

          </div>

          <div className="admin-formulario-grid">

            {/* TÍTULO */}

            <div>
              <label>
                Título
              </label>

              <input
                type="text"
                placeholder="Ex: Apartamento Centro"
                value={titulo}
                onChange={(e) =>
                  setTitulo(e.target.value)
                }
                required
              />
            </div>

            {/* TIPO */}

            <div>
              <label>
                Tipo do imóvel
              </label>

              <select
                value={tipoImovel}
                onChange={(e) =>
                  setTipoImovel(
                    e.target.value
                  )
                }
              >
                <option value="Apartamento">
                  Apartamento
                </option>

                <option value="Casa">
                  Casa
                </option>

                <option value="Studio">
                  Studio
                </option>

                <option value="Sobrado">
                  Sobrado
                </option>
              </select>
            </div>

            {/* NEGÓCIO */}

            <div>
              <label>
                Negócio
              </label>

              <select
                value={tipoNegocio}
                onChange={(e) =>
                  setTipoNegocio(
                    e.target.value
                  )
                }
              >
                <option value="Aluguel">
                  Aluguel
                </option>

                <option value="Venda">
                  Venda
                </option>
              </select>
            </div>

            {/* STATUS */}

            <div>
              <label>
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
              >
                <option value="Disponível">
                  Disponível
                </option>

                <option value="Alugado">
                  Alugado
                </option>

                <option value="Vendido">
                  Vendido
                </option>

                <option value="Indisponível">
                  Indisponível
                </option>
              </select>
            </div>

            {/* PREÇO */}

            <div>
              <label>
                Preço
              </label>

              <input
                type="number"
                min="0"
                placeholder="Ex: 1800"
                value={preco}
                onChange={(e) =>
                  setPreco(e.target.value)
                }
                required
              />
            </div>

            {/* CONDOMÍNIO */}

            <div>
              <label>
                Condomínio
              </label>

              <input
                type="number"
                min="0"
                placeholder="Ex: 400"
                value={condominio}
                onChange={(e) =>
                  setCondominio(
                    e.target.value
                  )
                }
              />
            </div>

            {/* CIDADE */}

            <div>
              <label>
                Cidade
              </label>

              <input
                type="text"
                value={cidade}
                onChange={(e) =>
                  setCidade(e.target.value)
                }
                required
              />
            </div>

            {/* BAIRRO */}

            <div>
              <label>
                Bairro
              </label>

              <input
                type="text"
                value={bairro}
                onChange={(e) =>
                  setBairro(e.target.value)
                }
                required
              />
            </div>

            {/* ENDEREÇO */}

            <div className="campo-largo">

              <label>
                Endereço
              </label>

              <input
                type="text"
                placeholder="Rua, número"
                value={endereco}
                onChange={(e) =>
                  setEndereco(
                    e.target.value
                  )
                }
                required
              />

            </div>

            {/* QUARTOS */}

            <div>
              <label>
                Quartos
              </label>

              <input
                type="number"
                min="0"
                value={quartos}
                onChange={(e) =>
                  setQuartos(e.target.value)
                }
                required
              />
            </div>

            {/* BANHEIROS */}

            <div>
              <label>
                Banheiros
              </label>

              <input
                type="number"
                min="0"
                value={banheiros}
                onChange={(e) =>
                  setBanheiros(
                    e.target.value
                  )
                }
                required
              />
            </div>

            {/* ÁREA */}

            <div>
              <label>
                Área em m²
              </label>

              <input
                type="number"
                min="0"
                value={area}
                onChange={(e) =>
                  setArea(e.target.value)
                }
                required
              />
            </div>

            {/* IMAGEM */}

            <div className="campo-largo">

              <label>
                Imagem
              </label>

              <input
                type="text"
                placeholder="/imoveis/nome-da-imagem.webp"
                value={imagemUrl}
                onChange={(e) =>
                  setImagemUrl(
                    e.target.value
                  )
                }
              />

            </div>

            {/* DESCRIÇÃO */}

            <div className="campo-largo">

              <label>
                Descrição
              </label>

              <textarea
                rows="5"
                placeholder="Descrição do imóvel"
                value={descricao}
                onChange={(e) =>
                  setDescricao(
                    e.target.value
                  )
                }
              />

            </div>

          </div>

          {/* SALVAR */}

          <button
            className="admin-salvar"
            type="submit"
            disabled={salvando}
          >
            {salvando
              ? "Salvando..."
              : idEditando
              ? "Salvar alterações"
              : "Cadastrar imóvel"}
          </button>

          {mensagem && (
            <p className="admin-mensagem">
              {mensagem}
            </p>
          )}

        </form>
      )}

      {/* TABELA */}

      {carregando ? (
        <p>
          Carregando imóveis...
        </p>
      ) : (
        <div className="admin-tabela-container">

          <table className="admin-tabela">

            <thead>
              <tr>
                <th>Imóvel</th>
                <th>Cidade</th>
                <th>Quartos</th>
                <th>Preço</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>

              {imoveis.map((imovel) => (

                <tr key={imovel.id}>

                  <td>
                    <strong>
                      {imovel.titulo}
                    </strong>

                    <br />

                    <small>
                      {imovel.bairro}
                    </small>
                  </td>

                  <td>
                    {imovel.cidade}
                  </td>

                  <td>
                    {imovel.quartos}
                  </td>

                  <td>
                    R${" "}
                    {Number(
                      imovel.preco || 0
                    ).toLocaleString(
                      "pt-BR",
                      {
                        minimumFractionDigits: 2,
                      }
                    )}
                  </td>

                  <td>
                    {imovel.status}
                  </td>

                  <td>

                    <div className="admin-botoes">

                      <button
                        type="button"
                        className="botao-editar"
                        onClick={() =>
                          editarImovel(imovel)
                        }
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        className="botao-excluir"
                        onClick={() =>
                          excluirImovel(imovel)
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

          {imoveis.length === 0 && (
            <p className="admin-vazio">
              Nenhum imóvel cadastrado.
            </p>
          )}

        </div>
      )}

    </div>
  );
}

export default AdminImoveis;