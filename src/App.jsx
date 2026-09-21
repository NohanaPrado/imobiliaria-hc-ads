import { useEffect, useState } from "react";
import ImovelCard from "./components/ImovelCard";
import {supabase} from "./lib/supabase"
import "./App.css";
function App() {
  const [imoveisBanco, setImoveisBanco] = useState([]);
  const imoveis = [
    {
      id: 1,
      titulo: "Apartamento Centro",
      imagem: "/imoveis/apartamento-centro.jpg.webp",
      endereco: "Rua das Flores, 120",
      bairro: "Centro",
      cidade: "Curitiba",
      quartos: 1,
      banheiros: 1,
      area: 40,
      aluguel: "1.400,00",
      condominio: "350,00",
    },

    {
      id: 2,
      titulo: "Apartamento Cristo Rei",
     imagem: "/imoveis/apartamento-cristo-rei.jpg.webp",
      endereco: "Rua São José, 250",
      bairro: "Cristo Rei",
      cidade: "Curitiba",
      quartos: 2,
      banheiros: 1,
      area: 55,
      aluguel: "1.800,00",
      condominio: "420,00",
    },

    {
      id: 3,
      titulo: "Apartamento Água Verde",
      imagem: "/imoveis/apartamento-agua-verde.jpg.webp",
      endereco: "Avenida República Argentina, 850",
      bairro: "Água Verde",
      cidade: "Curitiba",
      quartos: 3,
      banheiros: 2,
      area: 78,
      aluguel: "2.500,00",
      condominio: "650,00",
    },

    {
      id: 4,
      titulo: "Studio Rebouças",
      imagem: "/imoveis/studio-reboucas.webp.webp",
      endereco: "Rua Chile, 430",
      bairro: "Rebouças",
      cidade: "Curitiba",
      quartos: 1,
      banheiros: 1,
      area: 30,
      aluguel: "1.250,00",
      condominio: "280,00",
    },

    {
      id: 5,
      titulo: "Apartamento Batel",
      imagem: "/imoveis/apartamento-batel.jpg.webp",
      endereco: "Rua Buenos Aires, 720",
      bairro: "Batel",
      cidade: "Curitiba",
      quartos: 2,
      banheiros: 2,
      area: 68,
      aluguel: "2.900,00",
      condominio: "700,00",
    }
  ];
    useEffect(() => {

  async function buscarImoveis() {

    const { data, error } = await supabase
      .from("imoveis")
      .select("*");

    if (error) {
      console.error("Erro ao buscar imóveis:", error);
      return;
    }

    console.log("Imóveis do Supabase:", data);

    setImoveisBanco(data);
  }

  buscarImoveis();

}, []);

 return (

  <div className="site">

    {/* MENU */}
    <header className="cabecalho">
      <div className="container menu">

        <div className="logo">
          HC <span>Imóveis</span>
        </div>

        <nav>
          <a href="#inicio">Início</a>
          <a href="#imoveis">Imóveis</a>
          <a href="#contato">Contato</a>
        </nav>

        <a href="#imoveis" className="botao-menu">
          Ver imóveis
        </a>

      </div>
    </header>


    {/* CAPA */}
    <section className="hero" id="inicio">

      <div className="hero-conteudo">

        <span className="hero-etiqueta">
          IMÓVEIS PARA LOCAÇÃO
        </span>

        <h1>
          Encontre o imóvel
          <span> ideal para você.</span>
        </h1>

        <p>
          Apartamentos selecionados em Curitiba com informações
          claras, praticidade e segurança para sua locação.
        </p>

        <div className="hero-botoes">

  <a href="#imoveis" className="botao-hero">
    Ver imóveis disponíveis
  </a>

  <a href="#contato" className="botao-hero-secundario">
    Falar com atendimento
  </a>

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
            <strong>Locação facilitada</strong>
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
            Escolha uma das opções disponíveis para locação.
          </p>
        </div>


        <div className="lista-imoveis">

        {imoveisBanco.map((imovel) => (
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
    aluguel={Number(imovel.preco).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    })}
    condominio={Number(imovel.condominio || 0).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    })}
  />
))}

        </div>

      </div>

    </section>


    {/* CONTATO */}
    <section className="contato" id="contato">

  <div className="container contato-conteudo">

    <div className="contato-texto">

      <span>FALE CONOSCO</span>

      <h2>
        Precisa de ajuda para encontrar um imóvel?
      </h2>

      <p>
        Nossa equipe está pronta para ajudar você a conhecer
        as opções disponíveis.
      </p>

      <div className="dados-contato">

        <p>
          📞 <strong>(41) 99228-6652</strong>
        </p>

        <p>
          ✉️ <strong>contato.hcimoveis@gmail.com</strong>
        </p>

        <p>
          📍 Curitiba - Paraná
        </p>

      </div>

    </div>

    <button className="botao-contato">
      Falar com atendimento
    </button>

  </div>

</section>


    {/* RODAPÉ */}
    <footer>

  <div className="container rodape">

    <div>
      <strong>HC Imóveis</strong>
      <p>Seu próximo imóvel começa aqui.</p>
    </div>

    <div className="rodape-contato">
      <p>📞 (41) 99228-6652</p>
      <p>✉️ contato.hcimoveis@gmail.com</p>
    </div>

    <div>
      <p>Projeto acadêmico - ADS</p>
    </div>

  </div>

</footer>

  </div>
);
}
export default App;