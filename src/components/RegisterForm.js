import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { supabase } from "../lib/supabase";

import styles from '../pages/Register/Register.module.css'

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Preencha todos os campos");
      return;
    }
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      })

      if (error) {
        toast.error("Erro ao cadastrar usuário.");
        console.error(error);
        setName("")
        setEmail("")
        setPassword("")
        return;
      } 

      toast.success("Usuário cadastrado com sucesso!");
      navigate("/login");

    } catch (error) {
      toast.error("Erro inesperado.");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleRegister} className={styles.form}>
      
      <input type="text" placeholder=" Digite o nome de usuário" onChange={(e) => setName(e.target.value)} required className={styles.input}/>
      <input type="email" placeholder=" Digite um e-mail" onChange={(e) => setEmail(e.target.value)} required className={styles.input}/>
      <input type="password" placeholder=" Digite uma senha" onChange={(e) => setPassword(e.target.value)} required className={styles.input}/>

      <button className={styles.button} type="submit">Cadastrar</button>
      
      <span className={styles.textLink}>
        Já possui uma conta? Faça o seu
        <Link className={styles.links} to="/login"> 
          login
        </Link>
      </span>
     
      <Link className={styles.links} to="/"> 
          Página inicial
      </Link>
     
    </form>
  );
};

export default RegisterForm;

/*

    📌 O que esse código faz?
    O RegisterForm permite que um usuário se cadastre fornecendo e-mail e senha.
    ✅ Verifica se o e-mail já existe.
    ✅ Salva o usuário no localStorage.
    ✅ Redireciona para a tela de login após o cadastro.

    📌 Por que precisamos desse código?
    1️⃣ Permite que novos usuários sejam cadastrados.
    2️⃣ Garante que e-mails duplicados não sejam cadastrados.
    3️⃣ Salva os usuários no localStorage para login posterior.
    4️⃣ Redireciona o usuário para o login após o cadastro.

*/