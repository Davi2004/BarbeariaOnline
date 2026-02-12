import { useContext, useEffect, useState, useRef } from "react";
import { supabase } from "../../lib/supabase";
import { Trash2, Pencil, Check, X } from "lucide-react";
import Header from "../../components/Header/header";
import { toast } from "react-toastify";
import styles from "./admin.module.css";
import { AuthContext } from "../../context/AuthContext";

const Admin = () => {
  const [servicos, setServicos] = useState([]);
  const [barbeiros, setBarbeiros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editBarbeiroId, setEditBarbeiroId] = useState(null)
  const [editServicoId, setEditServicoId] = useState(null)
  const [editNome, setEditNome] = useState("")
  const [editPreco, setEditPreco] = useState("")

  const inputRef = useRef(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (editBarbeiroId !== null || editServicoId !== null) {
      inputRef.current?.focus();
    }
  }, [editBarbeiroId, editServicoId]);


  async function fetchData() {
    const { data: servicosData } = await supabase
      .from("servicos")
      .select("*")
    ;
    
    const { data: barbeirosData } = await supabase
      .from("barbeiros")
      .select("*")
    ;

    setServicos(servicosData || []);
    setBarbeiros(barbeirosData || []);

    setLoading(false)
  }

  async function handleDeleteServico(id) {
    const { error } = await supabase.from("servicos").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao remover serviço");
      return;
    }

    toast.success("Serviço removido");
    setServicos(prev => prev.filter(s => s.id !== id));
  }

  async function handleDeleteBarbeiro(id) {
    const { error } = await supabase.from("barbeiros").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao remover barbeiro");
      return;
    }

    toast.success("Barbeiro removido");
    setBarbeiros(prev => prev.filter(b => b.id !== id));
  }

  async function handleUpdateBarbeiro(id) {
    const { error } = await supabase
      .from("barbeiros")
      .update({ nome: editNome })
      .eq("id", id);

    if (error) {
      toast.error("Erro ao editar barbeiro");
      return;
    }

    toast.success("Barbeiro atualizado");

    setBarbeiros(prev =>
      prev.map(b => (b.id === id ? { ...b, nome: editNome } : b))
    );

    setEditBarbeiroId(null);
  }

  async function handleUpdateServico(id) {
    const { error } = await supabase
      .from("servicos")
      .update({
        nome: editNome,
        preco: Number(editPreco)
      })
      .eq("id", id)
    ;

    if (error) {
      toast.error("Erro ao editar serviço");
      return;
    }

    toast.success("Serviço atualizado");

    setServicos(prev =>
      prev.map(s =>
      s.id === id
        ? { ...s, nome: editNome, preco: Number(editPreco) }
        : s
      )
    );

    setEditServicoId(null);
  }

  return (
    <main className={styles.container}>

      <Header
        title="Painel de Gestão"
        showVoltar={true}
        showServico={true}
        showBarbeiros={true}
      />

      <section className={styles.grid}>
        <div className={styles.card}>
          <h1>Barbeiros</h1>
          {loading ? (
            <div className={styles.loaderContainer}>
              <div className={styles.spinner}></div>
            </div>
          ) : (
            <>

              {barbeiros.length === 0 ? (
                <h2>Nenhum barbeiro cadastrado</h2>
              ) : (
                <>
                  {barbeiros.map(barbeiro => (
                    <div key={barbeiro.id} className={styles.row}>

                      {editBarbeiroId === barbeiro.id ? (
                        <>
                          <input
                            value={editNome}
                            onChange={e => setEditNome(e.target.value)}
                            className={styles.input}
                            ref={inputRef}
                          />

                          <div className={styles.icons}>
                            <Check 
                              onClick={() => handleUpdateBarbeiro(barbeiro.id)} 
                              style={{ cursor: "pointer", color: "green" }}
                            />
                            <X 
                              onClick={() => setEditBarbeiroId(null)} 
                              style={{ cursor: "pointer", color: "red" }}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <span>{barbeiro.nome}</span>
                          <div className={styles.icons}>
                            {user?.is_admin && (
                              <Pencil
                                onClick={() => {
                                  setEditBarbeiroId(barbeiro.id)
                                  setEditNome(barbeiro.nome)
                                }}
                                style={{ cursor: "pointer", color: "#5555f0" }}
                                className={styles.iconDelete}
                              />
                            )}
                            
                            <Trash2
                              className={styles.iconDelete}
                              onClick={() => handleDeleteBarbeiro(barbeiro.id)}
                              style={{ cursor: "pointer", color: "red" }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>

        <div className={styles.card}>
          <h1>Serviços</h1>
          {loading ? (
            <div className={styles.loaderContainer}>
              <div className={styles.spinner}></div>
            </div>
          ) : (
            <>

              {servicos.length === 0 ? (
                <h2>Nenhum serviço cadastrado</h2>
              ) : (
                <>
                  {servicos.map(servico => (
                    <div key={servico.id} className={styles.row}>
                      {editServicoId === servico.id ? (
                        <>
                          <input
                            className={styles.inputService}
                            value={editNome}
                            onChange={e => setEditNome(e.target.value)}
                            placeholder="Nome"
                            ref={inputRef}
                          />

                          <input
                            className={styles.inputService}
                            type="number"
                            value={editPreco}
                            onChange={e => setEditPreco(e.target.value)}
                            placeholder="Preço"
                          />

                          <div className={styles.icons}>
                            <Check 
                              onClick={() => handleUpdateServico(servico.id)}
                              style={{ cursor: "pointer", color: "green" }}
                            />
                            <X 
                              onClick={() => setEditServicoId(null)} 
                              style={{ cursor: "pointer", color: "red" }}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <span>{servico.nome} — R$ {servico.preco.toFixed(2)}</span>
                          <div className={styles.icons}>
                            {user?.is_admin && (
                              <Pencil
                                onClick={() => {
                                  setEditServicoId(servico.id);
                                  setEditNome(servico.nome);
                                  setEditPreco(servico.preco);
                                }}
                                style={{ cursor: "pointer", color: "#5555f0" }}
                                className={styles.iconDelete}
                              />
                            )}
                            
                            <Trash2
                              className={styles.iconDelete}
                              onClick={() => handleDeleteServico(servico.id)}
                              style={{ cursor: "pointer", color: "red" }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </section>

    </main>
  );
};

export default Admin;