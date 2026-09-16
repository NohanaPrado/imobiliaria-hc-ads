function ImovelCard({
  imagem,
  titulo,
  endereco,
  bairro,
  cidade,
  quartos,
  banheiros,
  area,
  aluguel,
  condominio,
}) {
  return (

  <div className="imovel-card">

    <div className="imagem-area">
      <img
        src={imagem}
        alt={titulo}
        className="imovel-imagem"
      />

      <span className="status-imovel">
        Disponível
      </span>
    </div>

    <div className="imovel-conteudo">

      <h3>{titulo}</h3>

      <p className="localizacao">
        📍 {endereco}
      </p>

      <p className="bairro">
        {bairro} - {cidade}
      </p>

      <div className="detalhes-imovel">

        <span>
          🛏️ {quartos}
        </span>

        <span>
          🚿 {banheiros}
        </span>

        <span>
          📐 {area} m²
        </span>

      </div>

      <div className="valor-imovel">
        <small>Aluguel</small>

        <strong>
          R$ {aluguel}
        </strong>

        <span>/ mês</span>
      </div>

      <p className="valor-condominio">
        Condomínio: R$ {condominio}
      </p>

      <button>
        Ver detalhes
      </button>

    </div>

  </div>
);
}

export default ImovelCard;