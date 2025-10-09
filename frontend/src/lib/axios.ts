import axios from 'axios';


const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL;

const api = axios.create({
  baseURL: baseURL,
  timeout: 30000,
  withCredentials:true
});

export default api;