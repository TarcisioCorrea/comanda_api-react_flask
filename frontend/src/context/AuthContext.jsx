import React, { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { loginFuncionario } from '../services/funcionarioService';

// Criação do contexto
const AuthContext = createContext();

// Provedor do contexto
export const AuthProvider = ({ children }) => {
    // Inicializa o estado com base no valor do sessionStorage
    // sessionStorage é um armazenamento temporário que persiste enquanto a aba estiver aberta
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return sessionStorage.getItem("loginRealizado") === "true";
    });

    // useNavigate é um hook do React Router que permite programaticamente navegar entre rotas
    const navigate = useNavigate();

    // Função para login
    const login = async (username, password) => {
        try {
            if (username.startsWith('@')) {
                const localUser = username.substring(1);
                const envUser = import.meta.env.VITE_LOCAL_USER;
                const envPass = import.meta.env.VITE_LOCAL_PASS;

                if (localUser === envUser && password === envPass) {
                    setIsAuthenticated(true);
                    sessionStorage.setItem("loginRealizado", "true");
                    sessionStorage.setItem("user", envUser);
                    sessionStorage.setItem("userGroup", "Admin");
                    toast.success("Login local realizado com sucesso!");
                    navigate("/home");
                    return;
                }
                throw new Error("Credenciais locais inválidas");
            }

            // Autenticação via API (CPF normal)
            const response = await loginFuncionario(username, password);

            if (response.id_funcionario) {
                setIsAuthenticated(true);
                sessionStorage.setItem("loginRealizado", "true");
                sessionStorage.setItem("user", username);
                sessionStorage.setItem("userGroup", response.grupo == 1 ? "Admin" : response.grupo == 1 ? "Atendimento Balcão" : "Atendimento Caixa");
                toast.success("Login realizado com sucesso!");
                navigate("/home");
            } else {
                throw new Error("Falha na autenticação");
            }

        } catch (error) {
            toast.error(error.message || "Erro durante o login");
        }
    };

    // Função para logout
    const logout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem("loginRealizado");
        sessionStorage.removeItem("userGroup");
        toast.success("Deslogado com sucesso");
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook para usar o contexto
export const useAuth = () => useContext(AuthContext);