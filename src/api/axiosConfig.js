import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dd5f-34-86-71-217.ngrok-free.app/',
  headers: {
    'ngrok-skip-browser-warning': 'true',
    'Content-Type': 'application/json'
}
});

export default api;
