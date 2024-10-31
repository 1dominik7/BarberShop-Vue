import axios from 'axios';
import type { AxiosInstance } from 'axios';

const client:AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASED_URL,
  withCredentials: true,
});

export default client;
