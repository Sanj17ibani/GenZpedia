import axios from 'axios';
import { API_URL } from '../../config';

// Fallback to a localhost standard address if env isn't loaded (Note: Adjust to your machine's local IP for physical devices)
const BASE_URL = API_URL || 'http://localhost:5001';

export const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchAllSlangs = async () => {
    try {
        const response = await apiClient.get('/slang');
        return response.data.data;
    } catch (error) {
        console.error("Error fetching slangs:", error);
        throw error;
    }
}

export const contributeSlang = async (slangData: any) => {
    try {
        const response = await apiClient.post('/slang', slangData);
        return response.data;
    } catch (error) {
        console.error("Error contributing slang:", error);
        throw error;
    }
}
