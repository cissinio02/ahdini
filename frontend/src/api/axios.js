import axios from 'axios';

const api =axios.create({
    baseURL: 'http://localhost/ahdini/backend/api/',
    withCredentials: true,
})
export default api;