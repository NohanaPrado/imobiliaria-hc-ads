import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ImovelCard from "../components/ImovelCard";
import { supabase } from "../lib/supabase";
import "../App.css";
function Home() {
  // IMÓVEIS
  const [imoveisBanco, setImoveisBanco] = useState([]);

  // FILTROS
  const [cidadeFiltro, setCidadeFiltro] = useState("");
  const [precoMaximo, setPrecoMaximo] = useState("");
  const [quartosFiltro, setQuartosFiltro] = useState("");
  const [tipoNegocioFiltro, setTipoNegocioFiltro] = useState("");

  // FORMULÁRIO
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [imovelSelecionado, setImovelSelecionado] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [mensagemEnvio, setMensagemEnvio] = useState("");
  const [enviando, setEnviando] = useState(false);

  // BUSCAR IMÓVEIS NO SUPABASE
  useEffect(() => {
    async function buscarImoveis() {
      const { data, error } = await supabase
        .from("imoveis")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("Erro ao buscar imóveis:", error);
        return;
      }

      setImoveisBanco(data || []);
    }

    buscarImoveis();
  }, []);

  // FILTRAR IMÓVEIS
  const imoveisFiltrados = imoveisBanco.filter((imovel) => {
    const atendeCidade =
      cidadeFiltro === "" ||
      imovel.cidade
        ?.toLowerCase()
        .includes(cidadeFiltro.toLowerCase());

    const atendePreco =
      precoMaximo === "" ||
      Number(imovel.preco) <= Number(precoMaximo);

    const atendeQuartos =
      quartosFiltro === "" ||
      Number(imovel.quartos) === Number(quartosFiltro);

    const atendeTipo =
      tipoNegocioFiltro === "" ||
      imovel.tipo_negocio === tipoNegocioFiltro;

    return (
      atendeCidade &&
      atendePreco &&
      atendeQuartos &&
      atendeTipo
    );
  });

  // ENVIAR PROPOSTA / INTERESSE
  async function enviarInteresse(event) {
    event.preventDefault();

    setMensagemEnvio("");
    setEnviando(true);

    const { error } = await supabase
      .from("propostas")
      .insert([
        {
          nome: nome,
          email: email,
          telefone: telefone,
          imovel_id:
            imovelSelecionado === ""
              ? null
              : Number(imovelSelecionado),
          mensagem: mensagem,
          status: "Nova",
        },
      ]);

    if (error) {
      console.error("Erro ao enviar proposta:", error);

      setMensagemEnvio(
        "Não foi possível enviar. Precisamos configurar a tabela de propostas no Supabase."
      );

      setEnviando(false);
      return;
    }

    setMensagemEnvio("Interesse enviado com sucesso!");

    setNome("");
    setEmail("");
    setTelefone("");
    setImovelSelecionado("");
    setMensagem("");

    setEnviando(false);
  }

  return (
    <div className="site">

      {/* MENU / HEADER */}
      <header className="cabecalho">
        <div className="container menu">

          <div className="logo">
            HC <span>Imóveis</span>
          </div>
<nav>
  <a href="#inicio">Início</a>
  <a href="#imoveis">Imóveis</a>
  <a href="#sobre">Sobre</a>
  <a href="#servicos">Serviços</a>

  <Link to="/contato">
    Contato
  </Link>

  <Link to="/login">
    Entrar
  </Link>
</nav>

          <a href="#imoveis" className="botao-menu">
            Ver imóveis
          </a>

        </div>
      </header>

      {/* CAPA / HERO */}
      <section className="hero" id="inicio">

        <div className="hero-conteudo">

          <span className="hero-etiqueta">
            IMÓVEIS PARA LOCAÇÃO E VENDA
          </span>

          <h1>
            Encontre o imóvel
            <span> ideal para você.</span>
          </h1>

          <p>
            Apartamentos selecionados em Curitiba com informações
            claras, praticidade e segurança para sua negociação.
          </p>

          <div className="hero-botoes">

            <a href="#imoveis" className="botao-hero">
              Ver imóveis disponíveis
            </a>
<Link to="/contato" className="botao-hero-secundario">
  Falar com atendimento
</Link>
          </div>

        </div>

      </section>

      {/* BENEFÍCIOS */}
      <section className="beneficios">

        <div className="container beneficios-grid">

          <div className="beneficio">
            <span>🏠</span>

            <div>
              <strong>Imóveis selecionados</strong>
              <p>Opções para diferentes perfis</p>
            </div>
          </div>

          <div className="beneficio">
            <span>📍</span>

            <div>
              <strong>Boa localização</strong>
              <p>Imóveis em Curitiba</p>
            </div>
          </div>

          <div className="beneficio">
            <span>🔑</span>

            <div>
              <strong>Negociação facilitada</strong>
              <p>Informações claras e objetivas</p>
            </div>
          </div>

        </div>

      </section>

      {/* IMÓVEIS */}
      <section className="secao-imoveis" id="imoveis">

        <div className="container">

          <div className="titulo-secao">

            <span>OPORTUNIDADES</span>

            <h2>Imóveis disponíveis</h2>

            <p>
              Utilize os filtros para encontrar o imóvel ideal.
            </p>

          </div>

          {/* FILTROS */}
          <div className="filtros-imoveis">

            <input
              type="text"
              placeholder="Cidade"
              value={cidadeFiltro}
              onChange={(e) =>
                setCidadeFiltro(e.target.value)
              }
            />

            <input
              type="number"
              placeholder="Preço máximo"
              value={precoMaximo}
              onChange={(e) =>
                setPrecoMaximo(e.target.value)
              }
            />

            <select
              value={quartosFiltro}
              onChange={(e) =>
                setQuartosFiltro(e.target.value)
              }
            >

              <option value="">Quartos</option>
              <option value="1">1 quarto</option>
              <option value="2">2 quartos</option>
              <option value="3">3 quartos</option>

            </select>

            <select
              value={tipoNegocioFiltro}
              onChange={(e) =>
                setTipoNegocioFiltro(e.target.value)
              }
            >

              <option value="">
                Alugar ou comprar
              </option>

              <option value="Aluguel">
                Aluguel
              </option>

              <option value="Venda">
                Venda
              </option>

            </select>

            <button
              type="button"
              onClick={() => {
                setCidadeFiltro("");
                setPrecoMaximo("");
                setQuartosFiltro("");
                setTipoNegocioFiltro("");
              }}
            >
              Limpar filtros
            </button>

          </div>

          {/* LISTA DOS IMÓVEIS */}
          <div className="lista-imoveis">

            {imoveisFiltrados.map((imovel) => (

              <ImovelCard
                key={imovel.id}
                imagem={imovel.imagem_url}
                titulo={imovel.titulo}
                endereco={imovel.endereco}
                bairro={imovel.bairro}
                cidade={imovel.cidade}
                quartos={imovel.quartos}
                banheiros={imovel.banheiros}
                area={imovel.area}
                aluguel={Number(
                  imovel.preco
                ).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
                condominio={Number(
                  imovel.condominio || 0
                ).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              />

            ))}

          </div>

          {imoveisFiltrados.length === 0 && (
            <p style={{ textAlign: "center" }}>
              Nenhum imóvel encontrado com esses filtros.
            </p>
          )}

        </div>

      </section>

      {/* SOBRE A IMOBILIÁRIA */}
      <section className="sobre" id="sobre">

        <div className="container">

          <div className="titulo-secao">

            <span>SOBRE NÓS</span>

            <h2>HC Imóveis</h2>

          </div>

          <div className="sobre-conteudo">

            <div>

              <h3>
                Facilitando a busca pelo seu próximo imóvel
              </h3>

              <p>
                A HC Imóveis é uma plataforma imobiliária
                desenvolvida para facilitar o encontro entre
                clientes, proprietários e imóveis.
              </p>

              <p>
                Nosso objetivo é oferecer informações organizadas,
                atendimento simples e uma experiência prática para
                quem deseja alugar, comprar ou administrar um imóvel.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* SERVIÇOS */}
      <section className="servicos" id="servicos">

        <div className="container">

          <div className="titulo-secao">

            <span>NOSSOS SERVIÇOS</span>

            <h2>
              Soluções imobiliárias
            </h2>

            <p>
              Serviços pensados para proprietários,
              inquilinos e compradores.
            </p>

          </div>

          <div className="servicos-grid">

            <div className="servico">

              <span>🏡</span>

              <h3>Avaliação de imóveis</h3>

              <p>
                Auxílio na análise do imóvel e definição
                de valores para locação ou venda.
              </p>

            </div>

            <div className="servico">

              <span>🔑</span>

              <h3>Administração de aluguel</h3>

              <p>
                Organização de imóveis, contratos,
                inquilinos e informações de locação.
              </p>

            </div>

            <div className="servico">

              <span>📅</span>

              <h3>Agendamento de visitas</h3>

              <p>
                Clientes podem solicitar visitas
                aos imóveis disponíveis.
              </p>

            </div>

            <div className="servico">

              <span>📄</span>

              <h3>Gestão de contratos</h3>

              <p>
                Controle de contratos, valores,
                datas e informações importantes.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* CONTATO / PROPOSTA */}
      <section className="contato" id="contato">

        <div className="container">

          <div className="titulo-secao">

            <span>FALE CONOSCO</span>

            <h2>
              Tenho interesse em um imóvel
            </h2>

            <p>
              Preencha o formulário e envie sua mensagem.
            </p>

          </div>

          <div className="contato-conteudo">

            <div className="contato-texto">

              <h3>
                Precisa de ajuda?
              </h3>

              <p>
                Nossa equipe está pronta para ajudar você
                a conhecer as opções disponíveis.
              </p>

              <div className="dados-contato">

                <p>
                  📞 <strong>(41) 99228-6652</strong>
                </p>

                <p>
                  ✉️{" "}
                  <strong>
                    contato.hcimoveis@gmail.com
                  </strong>
                </p>

                <p>
                  📍 Curitiba - Paraná
                </p>

              </div>

            </div>

            {/* FORMULÁRIO */}
            <form
              className="formulario-contato"
              onSubmit={enviarInteresse}
            >

              <input
                type="text"
                placeholder="Seu nome"
                value={nome}
                onChange={(e) =>
                  setNome(e.target.value)
                }
                required
              />

              <input
                type="email"
                placeholder="Seu e-mail"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

              <input
                type="text"
                placeholder="Telefone"
                value={telefone}
                onChange={(e) =>
                  setTelefone(e.target.value)
                }
              />

              <select
                value={imovelSelecionado}
                onChange={(e) =>
                  setImovelSelecionado(e.target.value)
                }
              >

                <option value="">
                  Selecione um imóvel
                </option>

                {imoveisBanco.map((imovel) => (
                  <option
                    key={imovel.id}
                    value={imovel.id}
                  >
                    {imovel.titulo}
                  </option>
                ))}

              </select>

              <textarea
                placeholder="Digite sua mensagem"
                value={mensagem}
                onChange={(e) =>
                  setMensagem(e.target.value)
                }
                rows="5"
                required
              />

              <button
                type="submit"
                disabled={enviando}
              >

                {enviando
                  ? "Enviando..."
                  : "Enviar interesse"}

              </button>

              {mensagemEnvio && (
                <p>{mensagemEnvio}</p>
              )}

            </form>

          </div>

        </div>

      </section>

      {/* RODAPÉ / FOOTER */}
      <footer>

        <div className="container rodape">

          <div>

            <strong>HC Imóveis</strong>

            <p>
              Seu próximo imóvel começa aqui.
            </p>

          </div>

          <div className="rodape-contato">

            <p>
              📞 (41) 99228-6652
            </p>

            <p>
              ✉️ contato.hcimoveis@gmail.com
            </p>

          </div>

          <div>

            <p>
              Projeto acadêmico - ADS Carla e Nohana
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default Home;