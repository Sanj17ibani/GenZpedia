import axios from 'axios';

const BASE_URL ='https://unsaddened-stylishly-maeve.ngrok-free.dev';

export const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// GET all slangs
export const fetchAllSlangs = async () => {
  try {
    const response = await apiClient.get('/slang');
    return response.data.data; // backend gives { data: [...] }
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