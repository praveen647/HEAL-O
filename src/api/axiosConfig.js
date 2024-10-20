import axios from 'axios';

const api = axios.create({
  baseURL: 'https://disease-prediction-u62r.onrender.com/',
  headers: {
    'ngrok-skip-browser-warning': 'true',
    'Content-Type': 'application/json'
}
});

export default api;
