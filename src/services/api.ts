// src/services/api.ts

const BASE_URL = "http://localhost:8080"; 

const getToken = () => localStorage.getItem("token");

const api = async (endpoint: string, method = "GET", body: any = null) => {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  const token = getToken();
  
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ erro: "Erro desconhecido" }));
    throw new Error(err.erro || "Erro na requisição");
  }

  return response.json();
};

export const authService = {
  register: (data: any) => api("/auth/register", "POST", data),
  login: (data: any) => api("/auth/login", "POST", data),
};

export const userService = {
  buscar: (userId: string) => api(`/usuarios/${userId}`),
};

export const goalService = {
  criar: (data: any) => api("/metas", "POST", data),
  listar: (userId: string) => api(`/metas?userId=${userId}`),
  buscar: (id: string) => api(`/metas/${id}`),
depositar: (userId: string, goalId: string, valor: number) => 
    api("/movimentacoes", "POST", { 
      userId: userId, 
      goalId: goalId, 
      valor: valor, 
      tipo: "deposito" 
    }),
    
  sacar: (userId: string, goalId: string, valor: number) => 
    api("/movimentacoes", "POST", { 
      userId: userId, 
      goalId: goalId, 
      valor: valor, 
      tipo: "saque" 
    })
  };

export const transactionService = {
  depositar: (data: any) => api("/movimentacoes/deposito", "POST", data),
  listar: (userId: string) => api(`/movimentacoes?userId=${userId}`),
};

// --- NOVO SERVIÇO DE MISSÕES ---
export const missionService = {
  listarPorUsuario: (userId: string) => api(`/missoes/${userId}`),
};

export const statsService = {
  buscarPorUsuario: (userId: string) => api(`/estatisticas/${userId}`),
};