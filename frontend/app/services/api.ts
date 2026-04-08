import axios from 'axios';

const BASE_URL ='https://unsaddened-stylishly-maeve.ngrok-free.dev';

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

// POST slang
export const contributeSlang = async (slangData: any) => {
  try {
    const response = await apiClient.post('/slang', slangData);
    return response.data;
  } catch (error) {
    console.error("Error contributing slang:", error);
    throw error;
  }
};
