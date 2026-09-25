import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../App.css";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();

  async function entrar(event) {
    event.preventDefault();

    setMensagem("");
    setCarregando(true);

    // FAZER LOGIN
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: senha,
    });

    if (error) {
      console.error("Erro no login:", error);
      setMensagem("E-mail ou senha incorretos.");
      setCarregando(false);
      return;
    }

    const usuario = data.user;

    // BUSCAR O PERFIL DO USUÁRIO
    const { data: perfil, error: erroPerfil } = await supabase
      .from("perfis")
      .select("tipo")
      .eq("id", usuario.id)
      .single();

    if (erroPerfil || !perfil) {
      console.error("Erro ao buscar perfil:", erroPerfil);

      setMensagem(
        "Não foi possível identificar o tipo da sua conta."
      );

      await supabase.auth.signOut();

      setCarregando(false);
      return;
    }

    setCarregando(false);

    // REDIRECIONAR CONFORME O TIPO
    if (perfil.tipo === "admin") {
      navigate("/dashboard", { replace: true });
      return;
    }

    if (perfil.tipo === "proprietario") {
      navigate("/proprietario", { replace: true });
      return;
    }

    if (perfil.tipo === "cliente") {
      navigate("/cliente", { replace: true });
      return;
    }

    await supabase.auth.signOut();

    setMensagem("Tipo de usuário não reconhecido.");
  }

  return (
    <div className="pagina-login">

      <div className="login-container">

        <div className="login-logo">
          HC <span>Imóveis</span>
        </div>

        <div className="login-card">

          <span className="login-etiqueta">
            ACESSO AO SISTEMA
          </span>

          <h1>Bem-vindo</h1>

          <p>
            Entre com seu e-mail e senha para acessar sua conta.
          </p>

          <form onSubmit={entrar}>

            <label>E-mail</label>

            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Senha</label>

            <input
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={carregando}
            >
              {carregando ? "Entrando..." : "Entrar"}
            </button>

          </form>

          {mensagem && (
            <p className="login-mensagem">
              {mensagem}
            </p>
          )}

          <div className="login-cadastro">
            Ainda não possui uma conta?{" "}
            <Link to="/cadastro">
              Criar conta
            </Link>
          </div>

          <Link
            to="/"
            className="login-voltar"
          >
            ← Voltar para a página inicial
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;