import { useState } from "react";
import { supabase } from "../../lib/supabase";
import Header from "../../components/Header/header";
import { toast } from "react-toastify";
import styles from "./adminServicos.module.css"

const AdminServicos = () => {
    const [nome, setNome] = useState("");
    const [preco, setPreco] = useState("");

    async function handleAddServico(e) {
        e.preventDefault();

        const { error } = await supabase
        .from("servicos")
        .insert({ nome, preco });

        if (error) {
            toast.error("Erro ao adicionar serviço");
            return;
        }

        toast.success("Serviço adicionado!");
        setNome("");
        setPreco("");
    }

    return (
        <main className={styles.container}>
        
            <Header title="Admin • Serviços" showVoltar />

            <div className={styles.card}>
                <form onSubmit={handleAddServico} className={styles.form}>
            
                    <input
                        className={styles.input}
                        placeholder="Nome do serviço"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
            
                    <input
                        className={styles.input}
                        type="number"
                        step="0.01"
                        placeholder="Preço"
                        value={preco}
                        onChange={(e) => setPreco(e.target.value)}
                        required
                    />
            
                    <button type="submit">Adicionar</button>
                </form>
            </div>

        </main>
    );
};

export default AdminServicos;