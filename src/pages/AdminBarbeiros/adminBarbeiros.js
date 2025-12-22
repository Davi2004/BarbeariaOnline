import { useState } from "react";
import { supabase } from "../../lib/supabase";
import Header from "../../components/Header/header";
import { toast } from "react-toastify";
import styles from "./adminBarbeiros.module.css";

const AdminBarbeiros = () => {
    const [nome, setNome] = useState("");

    async function handleAddServico(e) {
        e.preventDefault();

        const { error } = await supabase
        .from("barbeiros")
        .insert({ nome });

        if (error) {
            toast.error("Erro ao adicionar barbeiro");
            return;
        }

        toast.success("Barbeiro adicionado!");
        setNome("");
    }

    return (
        <main className={styles.container}>
        
            <Header title="Admin • Barbeiros" showVoltar />

            <div className={styles.card}>
                <form onSubmit={handleAddServico} className={styles.form}>
            
                    <input
                        className={styles.input}
                        placeholder="Nome do Barbeiro"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
            
                    <button type="submit">Adicionar</button>
                </form>
            </div>

        </main>
    );
};

export default AdminBarbeiros;