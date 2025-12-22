import RegisterForm from "../../components/RegisterForm";
import styles from '../Register/Register.module.css'

const Register = () => {
    return(
        <main className={styles.wrapper}>
            
            <img
                src="/BarbeariaLogo2.png"
                alt="Logo"
                width={300}
            />
            
            <div className={styles.card}>
                <h1 className={styles.title}> Cadastro </h1>
                <RegisterForm />
            </div>

        </main>
    )
}

export default Register;