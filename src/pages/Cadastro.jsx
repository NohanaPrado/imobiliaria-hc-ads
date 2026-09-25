import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../App.css";

function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [perfil, setPerfil] = useState("cliente");

  const [mensagem, setMensagem] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function cadastrar(event) {
    event.preventDefault();

    setMensagem("");
    setSucesso(false);

    if (senha !== confirmarSenha) {
      setMensagem("As senhas não são iguais.");
      return;
    }

    if (senha.length < 6) {
      setMensagem("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    setCarregando(true);

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: senha,

      options: {
        data: {
          nome: nome,
          perfil: perfil,
        },
      },
    });

    if (error) {
      console.error("Erro ao cadastrar:", error);

      if (error.message.includes("already registered")) {
        setMensagem("Este e-mail já possui uma conta.");
      } else {
        setMensagem("Não foi possível realizar o cadastro.");
      }

      setCarregando(false);
      return;
    }

    console.log("Usuário cadastrado:", data);

    // Se o Supabase criou uma sessão automaticamente,
    // encerramos para o usuário entrar pela tela de login.
    if (data.session) {
      await supabase.auth.signOut();
    }

    setSucesso(true);
    setMensagem(
      "Cadastro realizado com sucesso! Agora você pode entrar na sua conta."
    );

    setNome("");
    setEmail("");
    setSenha("");
    setConfirmarSenha("");
    setPerfil("cliente");

    setCarregando(false);
  }

  return (
    <div className="pagina-cadastro">

      <div className="cadastro-lado-esquerdo">

        <div className="cadastro-marca">
          <div className="cadastro-icone">
            🏠
          </div>

          <h1>
            HC <span>Imóveis</span>
          </h1>

          <p>
            Encontre, alugue e acompanhe seus imóveis
            de forma simples e segura.
          </p>
        </div>

      </div>

      <div className="cadastro-lado-direito">

        <div className="cadastro-card">

          <div className="cadastro-logo-mobile">
            HC <span>Imóveis</span>
          </div>

          <h2>Crie sua conta</h2>

          <p className="cadastro-subtitulo">
            Cadastre-se para acessar os recursos da HC Imóveis.
          </p>

          <form onSubmit={cadastrar}>

            <label>Nome completo</label>

            <input
              type="text"
              placeholder="Digite seu nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />

            <label>E-mail</label>

            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Tipo de conta</label>

            <select
              value={perfil}
              onChange={(e) => setPerfil(e.target.value)}
            >
              <option value="cliente">
                Cliente - Inquilino / Comprador
              </option>

              <option value="proprietario">
                Proprietário
              </option>
            </select>

            <label>Senha</label>

            <input
              type="password"
              placeholder="Crie uma senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />

            <label>Confirmar senha</label>

            <input
              type="password"
              placeholder="Digite a senha novamente"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={carregando}
            >
              {carregando
                ? "Criando conta..."
                : "Criar conta →"}
            </button>

          </form>

          {mensagem && (
            <p
              className={
                sucesso
                  ? "cadastro-mensagem sucesso"
                  : "cadastro-mensagem erro"
              }
            >
              {mensagem}
            </p>
          )}

          <div className="cadastro-login">
            Já possui uma conta?{" "}

            <Link to="/login">
              Entrar
            </Link>
          </div>

          <Link
            to="/"
            className="cadastro-voltar"
          >
            ← Voltar para a página inicial
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Cadastro;