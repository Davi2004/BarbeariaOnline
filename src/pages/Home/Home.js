import { Link } from "react-router-dom";
import styles from './Home.module.css'

const Home = () => {
  return (
    <main className={styles.container}>
        
      <img 
        src="/BarbeariaLogo.png"
        alt="Logo da Barbearia"
        className={styles.logo}
      />
              
      <p className={styles.text}> Faça seu login ou cadastre-se para continuar. </p>

      <div className={styles.ContainerButtons}>

        <Link to="/login">
            <button className={styles.button}> Login </button>
        </Link>

        <Link to="/register">
          <button className={styles.button}> Cadastro </button>
        </Link>

      </div>
      
    </main>
  );
};

export default Home;