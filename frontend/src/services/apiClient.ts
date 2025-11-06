import { API_URL } from "./api";

// Faz a requisição para renovar o access token usando o refresh token salvo.
async function refreshToken(): Promise<string> {

  const refresh = typeof window !== "undefined" ? localStorage.getItem("refresh") : null;
 
  if (!refresh) throw new Error("Sem refresh token");

  const r = await fetch(`${API_URL}/api/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  // Tenta desserializar o JSON retornado.
  const d = await r.json();

  if (!r.ok || !d.access) throw new Error("Falha ao renovar token");

  // Persiste o novo access token no localStorage e também em cookie
  localStorage.setItem("access", d.access);
  document.cookie = `access=${d.access}; Path=/; SameSite=Lax`;

  return d.access as string;
}

export async function apiFetch<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_URL}${path}`;

  // Detecta se o body é FormData para não adicionar Content-Type (o browser define automaticamente com boundary)
  const isFormData = options.body instanceof FormData;
  
  const headers: HeadersInit = isFormData 
    ? { ...(options.headers || {}) }
    : { "Content-Type": "application/json", ...(options.headers || {}) };

  // Tenta recuperar access token do localStorage (apenas em browser).
  const access = typeof window !== "undefined" ? localStorage.getItem("access") : null;
  if (access) (headers as any).Authorization = `Bearer ${access}`;

  // Primeira tentativa de fetch com os headers atuais.
  let res = await fetch(url, { ...options, headers });

  // Se o backend respondeu 401 (token inválido/expirado), tenta renovar e repetir.
  if (res.status === 401) {
    const newAccess = await refreshToken();
    (headers as any).Authorization = `Bearer ${newAccess}`;
    res = await fetch(url, { ...options, headers });
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // Tentar extrair mensagens de erro detalhadas
    let errorMessage = '';
    
    if (data && typeof data === 'object') {
      // Se houver erros de campo específicos
      if (data.errors || data.non_field_errors) {
        const errors = data.errors || data.non_field_errors;
        if (Array.isArray(errors)) {
          errorMessage = errors.join(', ');
        } else if (typeof errors === 'object') {
          errorMessage = Object.entries(errors)
            .map(([field, msgs]: [string, any]) => 
              `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`
            )
            .join('; ');
        }
      } else if (data.detail) {
        errorMessage = data.detail;
      } else if (data.message) {
        errorMessage = data.message;
      } else {
        // Tentar pegar o primeiro erro de qualquer campo
        const firstError = Object.entries(data)
          .find(([key, value]) => key !== 'status' && value);
        if (firstError) {
          const [field, msgs] = firstError;
          errorMessage = `${field}: ${Array.isArray(msgs) ? msgs[0] : msgs}`;
        }
      }
    }
    
    throw new Error(errorMessage || `Erro ${res.status}`);
  }

  return data as T;
}

export const me = () => apiFetch("/api/accounts/me/");

