import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { supabase } from "../lib/supabase";

import styles from '../pages/RedefinirSenha/RedefinirSenha.module.css'

const ResetSenha = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "https://barbearia-online-nu.vercel.app/atualizar-senha"
      });

      if (error) {
        toast.error("Erro ao enviar e-mail de redefinição!");
        setLoading(false)
        return;
      }

      toast.success("Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.");
      setEmail("");
    } catch (error) {
      console.log(error)
      toast.error("Erro ao tentar redefinir a senha!");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleReset} className={styles.form}>
      <input
        type="email"
        placeholder="Digite seu e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className={styles.input}
      />
      
      <button className={styles.button} type="submit" disabled={loading}> 
        {loading ? "Enviando..." : "Enviar"}
      </button>

      <Link className={styles.links} to="/login">Página de Login</Link>
    </form>
  );
};

export default ResetSenha;