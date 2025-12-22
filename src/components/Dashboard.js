import { useContext, useState, useEffect } from "react"
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";
import { toast } from "react-toastify";
import { supabase } from "../lib/supabase";
import Header from '../components/Header/header'
import styles from '../pages/HomePage/HomePage.module.css'

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

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const dateCurrent = new Date().toISOString().split("T")[0];
  const [barbeiros, setBarbeiros] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]); // Estado para armazenar os agendamentos

  // Estado para capturar os valores do formulário
  const [formData, setFormData] = useState({
    barbeiro: "",
    servico: "",
    data: "",
    hora: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: barbeirosData, error: barbeirosError } =
          await supabase.from("barbeiros").select("*");

        const { data: servicosData, error: servicosError } =
          await supabase.from("servicos").select("*");

        if (barbeirosError || servicosError) {
          throw new Error("Erro ao buscar dados");
        }

        setBarbeiros(barbeirosData || []);
        setServicos(servicosData || []);
      } catch (error) {
        console.error("Erro ao buscar barbeiros/serviços:", error);
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
        let query = supabase
          .from("agendamentos")
          .select("*")
        ;

        if(!user.is_admin) {
          query = query.neq("status", "cancelado");
        }

        const { data, error } = await query;

        if (error) throw error;

        setAgendamentos(data || []);
      } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
        toast.error("Erro ao carregar agendamentos.");
      }
    };

    fetchAgendamentos();
  }, [user]);

  if (!user) {
    navigate("/"); // Se o usuário não estiver logado, redireciona para a página de login
    return;
  }

  // Função para capturar as mudanças no formulário
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Função para enviar o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Monta o objeto do agendamento no padrão do Supabase
    const novoAgendamento = {
      cliente_id: user.id,
      cliente_nome: user.name,
      barbeiro_id: formData.barbeiro,
      servico_id: formData.servico,
      data: formData.data,
      hora: formData.hora,
    };

    if (!novoAgendamento.barbeiro_id || !novoAgendamento.servico_id || !novoAgendamento.data || !novoAgendamento.hora) {
      toast.error("ALERTA!! Os campos do formulário não podem estar vazios.")
      return;
    }

    const agora = new Date();
    const dataHoraSelecionada = new Date(`${formData.data}T${formData.hora}`);

    if (dataHoraSelecionada < agora) {
      toast.error("Não é possível agendar um horário no passado.");
      return;
    }

    try {
      // Verificar se já existe um agendamento no mesmo barbeiro + dia + hora
      const { data: existe, error: checkError } = await supabase
        .from("agendamentos")
        .select("*")
        .eq("barbeiro_id", formData.barbeiro)
        .eq("data", formData.data)
        .eq("hora", formData.hora)
        .maybeSingle();

      if (checkError) {
        toast.error("Erro ao verificar disponibilidade.");
        return;
      }

      if (existe) {
        toast.error("Este horário já está ocupado para este barbeiro!");
        return;
      }
      
      const { error } = await supabase
        .from("agendamentos")
        .insert([novoAgendamento]);

      if (error) {
        console.error(error);
        toast.error("Erro ao criar agendamento.");
        return;
      }

      toast.success("Agendamento criado com sucesso!");

      // Recarrega a lista direto do Supabase
      const { data, error: fetchError } = await supabase
        .from("agendamentos")
        .select("*");

      if (fetchError) {
        toast.error("Erro ao carregar os agendamentos.");
        return;
      }

      setAgendamentos(data ?? []);

    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      toast.error("Erro ao criar agendamento.");
    }

    // Limpa o formulário
    setFormData({
      barbeiro: "",
      servico: "",
      data: "",
      hora: "",
    });
  };

  // Função para excluir um agendamento
  const handleCancel = async (id) => {
    const { error } = await supabase
      .from("agendamentos")
      .update({ status: "cancelado" })
      .eq("id", id);

    if (error) {
      toast.error("Erro ao cancelar agendamento.");
      return;
    }

    toast.success("Agendamento cancelado com sucesso!");

    const { data } = await supabase
      .from("agendamentos")
      .select("*")
    
    setAgendamentos(data ?? []);
  };

  return (
    <main className={styles.dashboard}>
      
      <Header 
        title={`Seja bem-vindo, ${user.name}`}
        showProdutos={true}
        showLogout={true}
      />

      {!user?.is_admin && (
        <div className={styles.card}>
          <h1> Agendar procedimento </h1>  

          <form className={styles.form} onSubmit={handleSubmit}>

            <div>
              <h3>Barbeiros</h3>
              <select
                className=""
                name="barbeiro"
                value={formData.barbeiro}
                onChange={handleChange}
              >
                <option value="" disabled>Selecione um barbeiro</option>
                {barbeiros.map((barbeiro) => (
                  <option key={barbeiro.id} value={barbeiro.id}>
                    {barbeiro.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <h3>Serviços</h3>
              <select
                className=""
                name="servico"
                value={formData.servico}
                onChange={handleChange}
              >
                <option value="" disabled>Selecione um serviço</option>
                {servicos.map((servico) => (
                  <option key={servico.id} value={servico.id}>
                    {servico.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.row}>
              <div>
                <h3>Data do Corte</h3>
                <input
                  type="date"
                  name="data"
                  min={dateCurrent}
                  value={formData.data}
                  onChange={handleChange}
                />
              </div>
              <div>
                <h3>Hora do Corte</h3>
                <input
                  type="time"
                  name="hora"
                  value={formData.hora}
                  onChange={handleChange}
                  step="60"
                  min={
                    formData.data === dateCurrent
                      ? new Date().toTimeString().slice(0, 5)
                      : "08:00"
                  }
                  max="20:00"
                />
              </div>
            </div>

            <button  type="submit">
              Agendar 
            </button>

          </form>
        </div>
      )}
      
    <div className={styles.card}>
      {agendamentos.length > 0 ? (
        <>
          <h1>Lista de clientes agendados</h1>
          <div className={styles.tableWrapper}>
            <table>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Barbeiro</th>
                  <th>Serviço</th>
                  <th>Preço</th>
                  <th>Data</th>
                  <th>Hora</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {agendamentos?.map((agendamento, index) => (
                  <tr key={index}>
                    <td>{agendamento?.cliente_nome || "Sem nome"}</td>  {/* Mostrar Nome do Cliente */}
                    <td>{barbeiros.find(b => b.id === agendamento.barbeiro_id)?.nome || "Desconhecido"}</td>
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
                      {(agendamento.cliente_id === user.id || user?.is_admin) &&
                        agendamento.status !== "cancelado" &&
                        getStatusAgendamento(agendamento) === "Agendado" && (
                          <XCircle
                            className={styles.iconDelete}
                            onClick={() => handleCancel(agendamento.id)}
                            style={{ cursor: "pointer", color: "red" }}
                            title="Cancelar agendamento"
                          />
                      )}
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

                  {(agendamento.cliente_id === user.id || user?.is_admin) &&
                    agendamento.status !== "cancelado" &&
                    getStatusAgendamento(agendamento) === "Agendado" && (
                      <XCircle
                        className={styles.iconDeleteMobile}
                        onClick={() => handleCancel(agendamento.id)}
                        style={{ cursor: "pointer", color: "red" }}
                        title="Cancelar agendamento"
                      />
                  )}

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

export default Dashboard;