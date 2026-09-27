import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../App.css";

function AdminImoveis() {
  const [imoveis, setImoveis] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarImoveis();
  }, []);

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

  return (
    <div className="admin-pagina">
      <div className="admin-cabecalho">
        <div>
          <span>PAINEL ADMINISTRATIVO</span>
          <h1>Gerenciar Imóveis</h1>
          <p>
            Cadastre, visualize, edite e exclua os imóveis da HC Imóveis.
          </p>
        </div>

        <Link to="/dashboard" className="admin-voltar">
          ← Voltar ao Dashboard
        </Link>
      </div>

      <div className="admin-acoes">
        <button type="button">
          + Cadastrar imóvel
        </button>
      </div>

      {carregando ? (
        <p>Carregando imóveis...</p>
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
                    <strong>{imovel.titulo}</strong>
                    <br />
                    <small>{imovel.bairro}</small>
                  </td>

                  <td>{imovel.cidade}</td>

                  <td>{imovel.quartos}</td>

                  <td>
                    R$ {Number(imovel.preco || 0).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </td>

                  <td>{imovel.status}</td>

                  <td>
                    <div className="admin-botoes">
                      <button
                        type="button"
                        className="botao-editar"
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        className="botao-excluir"
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