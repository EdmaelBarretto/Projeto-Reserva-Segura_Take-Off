// URL base do back-end Spring Boot
const BASE_URL = "http://localhost:8080";

// Pega o token JWT salvo no localStorage após o login
const getToken = () => localStorage.getItem("token");

// Função central que faz todas as chamadas ao back
const api = async (endpoint, method = "GET", body = null) => {
  const headers = { "Content-Type": "application/json" };

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

// ---- Autenticação ----
export const authService = {
  register: (data) => api("/auth/register", "POST", data),
  // data = { nome, email, cpf, senha }
  // retorna: { token, userId, nome }

  login: (data) => api("/auth/login", "POST", data),
  // data = { email, senha }
  // retorna: { token, userId, nome }
};

// ---- Metas (cofrinhos) ----
export const goalService = {
  criar: (data) => api("/metas", "POST", data),
  // data = { userId, nome, valorAlvo }

  listar: (userId) => api(`/metas?userId=${userId}`),
  // retorna: lista de metas do usuário

  buscar: (id) => api(`/metas/${id}`),
};

// ---- Movimentações (depósitos) ----
export const transactionService = {
  depositar: (data) => api("/movimentacoes/deposito", "POST", data),
  // data = { goalId, userId, valor }

  listar: (userId) => api(`/movimentacoes?userId=${userId}`),
};
