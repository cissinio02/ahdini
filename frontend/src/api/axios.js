import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost/ahdini/backend/api/',
    headers:{
        'Content-Type':'application/json',
    },
});
export default api;