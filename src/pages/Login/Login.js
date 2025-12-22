import LoginForm from "../../components/LoginForm";
import styles from '../Login/Login.module.css'

const Login = () => {
    return(
        <main className={styles.wrapper}>
            
            <img
                src="/BarbeariaLogo2.png"
                alt="Logo"
                width={300}
            />

            <div className={styles.card}>
                <h1 className={styles.title}> Login </h1>
                <LoginForm />
            </div>

        </main>
    )
}
export default Login;