import axios from 'axios';

export const API_URL = 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (data: any) => {
  const formData = new URLSearchParams();
  formData.append('username', data.email);
  formData.append('password', data.password);
  
  const res = await api.post('/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  return res.data;
};

export const register = async (data: any) => {
  const res = await api.post('/auth/register', data);
  return res.data;
};

export const getMe = async () => {
  const res = await api.get('/users/me');
  return res.data;
};

export const getAssessments = async () => {
  const { data } = await api.get('/assessments');
  return data;
};

export const getAssessment = async (id: string) => {
  const { data } = await api.get(`/assessments/${id}`);
  return data;
};

export const getQuestionBanks = async () => {
  const { data } = await api.get('/question-banks');
  return data;
};

export const getQuestions = async (bankId?: string) => {
  const url = bankId ? `/questions?bank_id=${bankId}` : '/questions';
  const { data } = await api.get(url);
  return data;
};

export const createAssessment = async (assessment: any) => {
  const { data } = await api.post('/assessments', assessment);
  return data;
};

export const startAttempt = async (assessmentId: string) => {
  const { data } = await api.post('/attempts', { assessment_id: assessmentId });
  return data;
};

export const saveAttempt = async (attemptId: string, answers: any, timeSpent: number) => {
  const { data } = await api.put(`/attempts/${attemptId}`, {
    answers,
    time_spent_seconds: timeSpent
  });
  return data;
};

export const submitAttempt = async (attemptId: string) => {
  const { data } = await api.post(`/attempts/${attemptId}/submit`);
  return data;
};

export const getAttempt = async (attemptId: string) => {
  const { data } = await api.get(`/attempts/${attemptId}`);
  return data;
};

export const getCertificates = async () => {
  const { data } = await api.get('/certificates');
  return data;
};

export const getAnalyticsDashboard = async () => {
  const { data } = await api.get('/analytics/dashboard');
  return data;
};
