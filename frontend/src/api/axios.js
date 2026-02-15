import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost/ahdini/backend/api/',
    withCredentials: true // Send cookies and session info
});

// Don't force JSON headers - let axios auto-detect based on data type
// FormData will automatically set Content-Type: multipart/form-data
// Regular objects will be sent as JSON

export default api;