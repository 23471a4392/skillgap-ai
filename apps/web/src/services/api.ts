const API_BASE_URL = import.meta.env.VITE_API_URL || '';

function getToken(): string | null {
  return localStorage.getItem('skillgap_token');
}

export function setToken(token: string) {
  localStorage.setItem('skillgap_token', token);
}

export function removeToken() {
  localStorage.removeItem('skillgap_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data.message || (data.errors ? data.errors[0]?.message : 'Request failed');
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  auth: {
    login: (body: any) => request<any>('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    register: (body: any) => request<any>('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    me: () => request<any>('/api/auth/me'),
    logout: () => request<any>('/api/auth/logout', { method: 'POST' }),
    logoutAll: () => request<any>('/api/auth/logout-all', { method: 'POST' }),
    changePassword: (body: any) => request<any>('/api/auth/change-password', { method: 'POST', body: JSON.stringify(body) }),
    forgotPassword: (body: any) => request<any>('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify(body) }),
    getSessions: () => request<any>('/api/auth/sessions'),
    deleteAccount: () => request<any>('/api/auth/delete-account', { method: 'DELETE' }),
  },
  profile: {
    get: () => request<any>('/api/profile'),
    update: (body: any) => request<any>('/api/profile', { method: 'PATCH', body: JSON.stringify(body) }),
    addSkill: (body: any) => request<any>('/api/profile/skills', { method: 'POST', body: JSON.stringify(body) }),
    updateSkill: (id: string, body: any) => request<any>(`/api/profile/skills/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    deleteSkill: (id: string) => request<any>(`/api/profile/skills/${id}`, { method: 'DELETE' }),
    addEducation: (body: any) => request<any>('/api/profile/education', { method: 'POST', body: JSON.stringify(body) }),
    updateEducation: (id: string, body: any) => request<any>(`/api/profile/education/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    deleteEducation: (id: string) => request<any>(`/api/profile/education/${id}`, { method: 'DELETE' }),
    addExperience: (body: any) => request<any>('/api/profile/experience', { method: 'POST', body: JSON.stringify(body) }),
    updateExperience: (id: string, body: any) => request<any>(`/api/profile/experience/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    deleteExperience: (id: string) => request<any>(`/api/profile/experience/${id}`, { method: 'DELETE' }),
    addProject: (body: any) => request<any>('/api/profile/projects', { method: 'POST', body: JSON.stringify(body) }),
    updateProject: (id: string, body: any) => request<any>(`/api/profile/projects/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    deleteProject: (id: string) => request<any>(`/api/profile/projects/${id}`, { method: 'DELETE' }),
    addCertification: (body: any) => request<any>('/api/profile/certifications', { method: 'POST', body: JSON.stringify(body) }),
    deleteCertification: (id: string) => request<any>(`/api/profile/certifications/${id}`, { method: 'DELETE' }),
  },
  skills: {
    getAll: (params?: { category?: string; search?: string }) => {
      const query = new URLSearchParams(params as any).toString();
      return request<any>(`/api/skills${query ? `?${query}` : ''}`);
    },
    getCategories: () => request<any>('/api/skills/categories'),
    getById: (id: string) => request<any>(`/api/skills/${id}`),
  },
  roles: {
    getAll: (params?: { department?: string; search?: string }) => {
      const query = new URLSearchParams(params as any).toString();
      return request<any>(`/api/roles${query ? `?${query}` : ''}`);
    },
    getById: (id: string) => request<any>(`/api/roles/${id}`),
  },
  analysis: {
    analyze: (body: any) => request<any>('/api/analysis/analyze', { method: 'POST', body: JSON.stringify(body) }),
    getHistory: () => request<any>('/api/analysis/history'),
    getById: (id: string) => request<any>(`/api/analysis/${id}`),
    getBenchmarks: () => request<any>('/api/analysis/benchmarks'),
    compare: (analysisIds: string[]) => request<any>('/api/analysis/compare', { method: 'POST', body: JSON.stringify({ analysisIds }) }),
  },
  roadmap: {
    getActive: () => request<any>('/api/roadmap'),
    getById: (id: string) => request<any>(`/api/roadmap/${id}`),
    toggleTask: (roadmapId: string, milestoneId: string, taskId: string) =>
      request<any>('/api/roadmap/task/toggle', { method: 'PATCH', body: JSON.stringify({ roadmapId, milestoneId, taskId }) }),
  },
  progress: {
    getOverview: () => request<any>('/api/progress'),
    logActivity: (body: any) => request<any>('/api/progress/log', { method: 'POST', body: JSON.stringify(body) }),
    retest: () => request<any>('/api/progress/retest', { method: 'POST' }),
  },
  applications: {
    getAll: () => request<any>('/api/applications'),
    create: (body: any) => request<any>('/api/applications', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: any) => request<any>(`/api/applications/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (id: string) => request<any>(`/api/applications/${id}`, { method: 'DELETE' }),
  },
  resume: {
    parse: (resumeText: string) => request<any>('/api/resume/parse', { method: 'POST', body: JSON.stringify({ resumeText }) }),
    apply: (body: any) => request<any>('/api/resume/apply', { method: 'POST', body: JSON.stringify(body) }),
    getQrToken: () => request<any>('/api/resume/qr-token'),
    getQrStatus: (token: string) => request<any>(`/api/resume/qr-status/${token}`),
    getQrSession: (token: string) => request<any>(`/api/resume/qr-session/${token}`),
    mobileUpload: (token: string, body: any) =>
      request<any>(`/api/resume/mobile-upload/${token}`, {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    quickFill: (body: any) => request<any>('/api/resume/quick-fill', { method: 'POST', body: JSON.stringify(body) }),
  },
};
