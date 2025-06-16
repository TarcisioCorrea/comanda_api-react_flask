import axios from "axios";

const PROXY_URL = import.meta.env.VITE_PROXY_BASE_URL + "funcionario/";

// Obter todos os funcionários
export const getFuncionarios = async () => {
  const response = await axios.get(`${PROXY_URL}all`);
  return response.data;
};

// Obter um funcionário por ID
export const getFuncionarioById = async (id) => {
  const response = await axios.get(`${PROXY_URL}one`, {
    params: { id_funcionario: id },
  });
  return response.data[0];
};

// Criar um novo funcionário
export const createFuncionario = async (funcionario) => {
  const response = await axios.post(`${PROXY_URL}`, funcionario);
  return response.data;
};

// Atualizar um funcionário existente
export const updateFuncionario = async (id, funcionario) => {
  const response = await axios.put(`${PROXY_URL}`, funcionario, {
    params: { id_funcionario: id },
  });
  return response.data;
};

// Deletar um funcionário
export const deleteFuncionario = async (id) => {
  const response = await axios.delete(`${PROXY_URL}`, {
    params: { id_funcionario: id },
  });
  return response.data;
};

// Adicione este novo método ( TODO: Implementar no backend uma rota para fazer a consulta direta no banco )
export const checkCpfExist = async (cpf, currentId = null) => {
  try {
    const allFuncionarios = await getFuncionarios();

    // Encontra funcionário com o mesmo CPF, excluindo o atual em edição
    const existing = allFuncionarios.find(
      (f) =>
        f.cpf === cpf &&
        (!currentId || f.id_funcionario !== parseInt(currentId))
    );

    return {
      exists: !!existing,
      existingId: existing?.id_funcionario || null,
    };
  } catch (error) {
    console.error("Erro ao verificar CPF:", error);
    return { exists: false, existingId: null };
  }
};

export const loginFuncionario = async (cpf, senha) => {
  try {
    const response = await axios.post(`${PROXY_URL}login`, { cpf, senha });
    return response.data;
  } catch (error) {
    console.error("Erro no login:", error.response?.data || error.message);
    throw error;
  }
};