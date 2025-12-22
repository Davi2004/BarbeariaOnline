import { createContext, useState, useEffect } from "react"; 
import { toast } from "react-toastify";
import { supabase } from "../lib/supabase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const getUserProfile = async (sessionUser) => {
    const { data, error } = await supabase
      .from("usuarios")
      .select("is_admin, nome")
      .eq("id", sessionUser.id)
      .single();

    if (error) {
      console.error("Erro ao buscar perfil:", error);
      return {
        is_admin: false,
        name: sessionUser.user_metadata?.nome
      };
    }

    return {
      is_admin: data.is_admin,
      name: data.nome
    };
  };

  // Carregar usuário autenticado ao abrir o site
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const profile = await getUserProfile(session.user);

        const userData = {
          id: session.user.id,
          email: session.user.email,
          name: profile.name,
          is_admin: profile.is_admin
        };

        setUser(userData);
      }

    };

    getSession();

    // Listener para mudanças de login/logout
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      
      if (session?.user) {
        (async () => {
          const profile = await getUserProfile(session.user);

          setUser({
            id: session.user.id,
            email: session.user.email,
            name: profile.name,
            is_admin: profile.is_admin
          });
          
        })();
      } else {
        setUser(null);
      }

    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  // Login com Supabase Auth
  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error("E-mail ou senha inválidos!");
        return false;
      }

      const profile = await getUserProfile(data.user);
      
      const userData = {
        id: data.user.id,
        email: data.user.email,
        name: profile.name,
        is_admin: profile.is_admin,
      };
      
      setUser(userData);
      
      toast.success("Login efetuado com sucesso!");
      return userData;
      
    } catch (err) {
      console.error(err);
      toast.error("Erro ao conectar com o Supabase!");
      return false;
    }
  };

  // Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast.success("Desconectado com sucesso! Até breve, volte sempre!");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};