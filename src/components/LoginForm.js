import { useState, useContext } from "react";
import { Eye, EyeOff } from 'lucide-react'
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import styles from '../pages/Login/Login.module.css'

const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const successLogin = await login(email, password);
  
    if (successLogin) {
      if (successLogin.is_admin) {
        navigate("/pageadmin");
      } else {
        navigate("/homepage")
      }
    }
  };

  return (

    <form onSubmit={handleLogin} className={styles.form}>
      
      <input type="email" placeholder="E-mail" onChange={(e) => setEmail(e.target.value)} required className={styles.input} />
      
      <div className={styles.passwordWrapper}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Senha"
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />
        <button
          type="button"
          onClick={ () => setShowPassword(!showPassword) }
          className={styles.togglePassword}
        >
          { showPassword ? <EyeOff size={20} /> : <Eye size={20} /> }
        </button>
      </div>

      <Link className={styles.links} to="/redefinirSenha"> 
        Esqueceu a senha?
      </Link> 
      
      <button className={styles.button} type="submit">Entrar</button>
      
      <span className={styles.textlink}>
         
        Ainda não tem uma conta? 
        <Link className={styles.links} to="/register"> 
          Cadastre-se 
        </Link> 
        
      </span>

      <Link className={styles.links} to="/">
          Página inicial
      </Link>
      
    </form>
  );
};

export default LoginForm;