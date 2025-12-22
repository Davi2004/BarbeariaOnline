import { AuthContext } from "../context/AuthContext";
import { useContext, useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { supabase } from "../lib/supabase";
import Header from '../components/Header/header'
import styles from '../pages/PageAdmin/pageadmin.module.css'

// 📌 Função para formatar data no formato dd/mm/aaaa
const formatarData = (dataISO) => {
    if (!dataISO) return ""; // Evita erro caso a data seja undefined
    const data = new Date(dataISO);
    return data.toLocaleDateString("pt-BR", { timeZone: "UTC" });
};
  
// 📌 Função para formatar hora no formato HH:mm
const formatarHora = (horaISO) => {
  if (!horaISO) return ""; // Evita erro caso a hora seja undefined
  return horaISO.slice(0, 5)
};

const getStatusAgendamento = (agendamento) => {
  if (agendamento.status === "cancelado") {
    return "Cancelado";
  }
  
  const agora = new Date();
  const dataAgendamento = new Date(`${agendamento.data}T${agendamento.hora}`);

  return dataAgendamento < agora ? "Concluído" : "Agendado";
}

const Admin = () => {
    const { user } = useContext(AuthContext);
    const [barbeiros, setBarbeiros] = useState([]);
    const [servicos, setServicos] = useState([]);
    const [agendamentos, setAgendamentos] = useState([]);

    useEffect(() => {
    const fetchData = async () => {
        try {
            const { data: barbeirosData, error: barbeirosError } = await supabase
                .from("barbeiros")
                .select("*");

            const { data: servicosData, error: servicosError } = await supabase
                .from("servicos")
                .select("*");

            if (barbeirosError || servicosError) {
                throw new Error("Erro ao buscar dados");
            }

            setBarbeiros(barbeirosData || []);
            setServicos(servicosData || []);
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
            toast.error("Erro ao carregar dados.");
        }
    };

    fetchData();
    }, []);
    
    // Isso garante que, ao abrir a página, a lista de agendamentos seja carregada do banco de dados.
    useEffect(() => {
        const fetchAgendamentos = async () => {
            if(!user) return;
            
            try {
                const { data, error } = await supabase
                    .from("agendamentos")
                    .select("*");

                if (error) throw error;

                console.log("Agendamentos carregados:", data);
                setAgendamentos(data || []);
            } catch (error) {
                console.error("Erro ao buscar agendamentos:", error);
                toast.error("Erro ao carregar agendamentos.");
            }
        };

        fetchAgendamentos();

    }, [user]);
    
    // Função para excluir um agendamento
    const handleDelete = async (id) => {
        try {
            const { error } = await supabase
            .from("agendamentos")
            .delete()
            .eq("id", id);

            if (error) throw error;

            toast.success("Agendamento removido com sucesso!");

            setAgendamentos((prev) =>
                prev.filter((agendamento) => agendamento.id !== id)
            );
        } catch (error) {
            console.error("Erro ao excluir agendamento:", error);
            toast.error("Erro ao excluir agendamento.");
    }
    };

    return (
        
        <main className={styles.dashboard}>

            <Header
                title={"Painel do Administrador"}
                showLogout={true}
                showAdmin={true}
            />

            <div className={styles.card}>
                {agendamentos.length > 0 ? (
                    <>
                        <h1> Clientes Agendados </h1>
                    
                        <div className={styles.tableWrapper}>

                            <table className={styles.tableAdmin}>
                                <thead className={styles.theadAdmin}>
                                    <tr className={styles.borderAdmin}>
                                        <th>Cliente</th>
                                        <th>Barbeiro</th>
                                        <th>Serviço</th>
                                        <th>Preço</th>
                                        <th>Data</th>
                                        <th>Hora</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody className={styles.borderAdmin}>

                                    {agendamentos?.map((agendamento, index) => (
                                        <tr key={index}>
                                            
                                            <td>{agendamento?.cliente_nome || "Sem Nome"}</td>  {/* Mostrar Nome do Cliente */}
                                            
                                            <td>
                                                {barbeiros.find(b => b.id === agendamento.barbeiro_id)?.nome || "Desconhecido"}
                                            </td>
                                            
                                            {(() => {
                                                const servico = servicos.find(s => s.id === agendamento.servico_id);
                                                return (
                                                <>
                                                    <td>{servico?.nome || "Desconhecido"}</td>
                                                    <td>R$ {servico?.preco?.toFixed(2) || "--"}</td>
                                                </>
                                                );
                                            })()}

                                            <td>{formatarData(agendamento.data)}</td> {/* Formata a data corretamente */}
                                            
                                            <td>{formatarHora(agendamento.hora)}</td> {/* Formata a hora corretamente */}
                                            
                                            <td>
                                                {(() => {
                                                const status = getStatusAgendamento(agendamento);

                                                return (
                                                    <span
                                                        className={
                                                            status === "Agendado"
                                                            ? styles.statusAgendado
                                                            : status === "Concluído"
                                                            ? styles.statusConcluido
                                                            : styles.statusCancelado
                                                        }
                                                    >
                                                        {status}
                                                    </span>
                                                );
                                                })()}
                                            </td>
                                            
                                            <td>
                                                <Trash2
                                                    className={styles.iconDelete}
                                                    onClick={() => handleDelete(agendamento.id)}
                                                    style={{ cursor: "pointer", color: "red" }}
                                                />
                                            </td>
                                            
                                        </tr>
                                    ))}
                                    
                                </tbody>
                                
                            </table>
                            
                        </div>

                        <div className={styles.listMobile}>
                            {agendamentos.map((agendamento) => {

                                const barbeiro = barbeiros.find(b => b.id === agendamento.barbeiro_id);
                                const servico = servicos.find(s => s.id === agendamento.servico_id);

                                return (
                                    <div className={styles.cardAgendamento} key={agendamento.id}>

                                        <p><strong>Cliente:</strong> {agendamento.cliente_nome}</p>
                                        <p><strong>Barbeiro:</strong> {barbeiro?.nome || "—"}</p>
                                        <p><strong>Serviço:</strong> {servico?.nome || "—"}</p>
                                        <p><strong>Preço:</strong> R$ {servico?.preco?.toFixed(2) || "--"}</p>
                                        <p><strong>Data:</strong> {formatarData(agendamento.data)}</p>
                                        <p><strong>Hora:</strong> {formatarHora(agendamento.hora)}</p>
                                        <p>
                                            <strong>Status:</strong>{" "}
                                            {(() => {
                                                const status = getStatusAgendamento(agendamento);

                                                return (
                                                <span
                                                    className={
                                                    status === "Agendado"
                                                        ? styles.statusAgendado
                                                        : status === "Concluído"
                                                        ? styles.statusConcluido
                                                        : styles.statusCancelado
                                                    }
                                                >
                                                    {status}
                                                </span>
                                                );
                                            })()}
                                        </p>

                                        <Trash2
                                            className={styles.iconDeleteMobile}
                                            onClick={() => handleDelete(agendamento.id)}
                                            style={{ cursor: "pointer", color: "red" }}
                                            title="Cancelar agendamento"
                                        />

                                    </div>
                                );
                            })}
                        </div> 
                    </>
                ) : (
                    <h2 className={styles.emptyMessage}>
                        Não temos clientes agendados
                    </h2>
                )}
            </div>
        </main>

    );
};

export default Admin;