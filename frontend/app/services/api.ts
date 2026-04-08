import axios from 'axios';
import { API_URL } from '../../config';

const normalizeBaseUrl = (url?: string) => url?.trim().replace(/\/+$/, '');

const CONFIGURED_API_URL = normalizeBaseUrl(API_URL);
const LOCAL_FALLBACKS = [
  'http://10.0.2.2:5001',
  'http://localhost:5001',
  'http://127.0.0.1:5001',
  'http://10.0.2.2:5000',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
];

const BASE_URL = CONFIGURED_API_URL || LOCAL_FALLBACKS[0];
const REQUEST_HEADERS = {
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': 'true',
};

const AUTH_BASE_URL_CANDIDATES = Array.from(
  new Set(
    [
      CONFIGURED_API_URL,
      BASE_URL,
      ...(CONFIGURED_API_URL ? [] : LOCAL_FALLBACKS),
    ].filter(Boolean)
  )
);

export const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: REQUEST_HEADERS,
  timeout: 8000,
});

const postWithFallback = async (path: string, payload: Record<string, unknown>) => {
  let lastError: unknown = null;

  for (const baseUrl of AUTH_BASE_URL_CANDIDATES) {
    try {
      const response = await axios.post(`${baseUrl}/api${path}`, payload, {
        headers: REQUEST_HEADERS,
        timeout: 4000,
      });

      return response.data;
    } catch (error: any) {
      lastError = error;

      const hasServerResponse = Boolean(error?.response);
      if (hasServerResponse) {
        throw error;
      }
    }
  }

  throw lastError;
};

export const loginUser = async (email: string, password: string) => {
  return postWithFallback('/auth/login', {
    email,
    password,
  });
};

export const signupUser = async (name: string, email: string, password: string) => {
  return postWithFallback('/auth/signup', {
    name,
    email,
    password,
  });
};

export const fetchAllSlangs = async () => {
  try {
    const response = await apiClient.get('/slang');
    return response.data.data;
  } catch (error) {
    console.error("Error fetching slangs:", error);
    throw error;
  }
};

export const contributeSlang = async (slangData: any) => {
  try {
    const response = await apiClient.post('/slang', slangData);
    return response.data;
  } catch (error) {
    console.error("Error contributing slang:", error);
    throw error;
  }
};
