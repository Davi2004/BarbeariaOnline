import ResetSenha from "../../components/ResetSenha";
import styles from './RedefinirSenha.module.css'

const RedefinirSenha = () => {
    return(
        <main className={styles.wrapper}>
            
            <img
                src="/BarbeariaLogo2.png"
                alt="Logo"
                width={300}
            />

            <div className={styles.card}>
                <h1 className={styles.title}> Redefinir Senha </h1>

                <p className={styles.subtitle}>
                    Informe seu email para receber o link de redefinição de senha.
                </p>
                
                <ResetSenha />
            </div>

        </main>
    )
}

export default RedefinirSenha;