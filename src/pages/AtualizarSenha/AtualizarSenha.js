import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { supabase } from "../../lib/supabase";

import styles from './AtualizarSenha.module.css'

const AtualizarSenha = () => {
  const navigate = useNavigate();

  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const setSession = async () => {
      const { error } = await supabase.auth.getSessionFromUrl({ storeSession: true });

      if (error) {
        toast.error("Link inválido ou expirado.");
        navigate("/login");
      }
    };

    setSession();
  }, [navigate]);
  
  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (senha.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: senha,
      });

      if (error) {
        console.error(error);
        toast.error("Erro ao atualizar senha!");
        setLoading(false);
        return;
      }

      if (data) {
        toast.success("Senha atualizada com sucesso!");
        setLoading(false);
        navigate("/login");
        return;
      }

    } catch (error) {
      console.error(error);
      toast.error("Erro inesperado ao atualizar senha.");
      setLoading(false);
    }
  };

  return (    
    <main className={styles.wrapper}>

      <img
        src="/BarbeariaLogo2.png"
        alt="Logo"
        width={300}
      />
      
      <div className={styles.card}>
        <h1 className={styles.title}>Atualizar Senha</h1>
        
        <form onSubmit={handleUpdatePassword} className={styles.form}>
          <input
            type="password"
            placeholder="Nova senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            className={styles.input}
          />

          <input
            type="password"
            placeholder="Confirmar nova senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
            className={styles.input}
          />
          
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Atualizando..." : "Salvar Senha"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default AtualizarSenha;