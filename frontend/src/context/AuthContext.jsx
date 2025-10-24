import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL;

// ✅ Creiamo un'istanza Axios con baseURL completo
const axiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
});

// ✅ Intercettore per aggiungere automaticamente il token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // ✅ Ora la chiamata è uniforme
        const res = await axiosInstance.get("/auth/me");
        setUser(res.data);
      } catch (error) {
        console.error("Errore nel recupero utente:", error);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // ✅ Login che salva token e ricarica i dati utente
  const login = async (token) => {
    localStorage.setItem("token", token);
    try {
      const res = await axiosInstance.get("/auth/me");
      setUser(res.data);
    } catch (error) {
      console.error("Errore nel login:", error);
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  // ✅ Logout pulito
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, axios: axiosInstance }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);