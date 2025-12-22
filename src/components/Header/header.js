import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

import styles from "./header.module.css";

const Header = ({
    title,
    showProdutos = false,
    showAdmin = false,
    showLogout = false,
    showVoltar = false,
    showServico = false,
    showBarbeiros = false,
}) => {
    const navigate = useNavigate();
    const { logout, user } = useContext(AuthContext);

    return (
        <header className={styles.header}>
            <img
                src="/BarbeariaLogo2.png"
                alt="Logo"
                className={styles.logo}
            />

            {title && <h1 className={styles.title}>{title}</h1>}

            <div className={styles.actions}>

                {showVoltar && (
                    <button className={styles.button} onClick={() => navigate(-1)}>
                        Voltar
                    </button>
                )}

                {showProdutos && (
                    <button className={styles.button} onClick={() => navigate("/produtos")}>
                        Produtos
                    </button>
                )}

                {showAdmin && user?.is_admin && (
                    <button className={styles.button} onClick={() => navigate("/admin")}>
                        Admin
                    </button>
                )}

                {showServico && (
                    <button className={styles.button} onClick={() => navigate("/admin/servicos")}>
                        Serviços
                    </button>
                )}

                {showBarbeiros && (
                    <button className={styles.button} onClick={() => navigate("/admin/barbeiros")}>
                        Barbeiros
                    </button>
                )}

                {showLogout && (
                    <button
                        className={`${styles.logout} ${styles.button}`}
                        onClick={() => {
                            logout();
                            navigate("/");
                        }}
                    >
                        Sair
                    </button>
                )}
                
            </div>
        </header>
    );
};

export default Header;