import axios from 'axios';

const API_URL = 'http://localhost:3001/api'; // Cambia esto si tu API usa otro puerto

export const getNoticias = async () => {
  try {
    const res = await axios.get(`${API_URL}/noticias`);
    return res.data;
  } catch (err) {
    console.error('Error al obtener noticias:', err);
    return [];
  }
};
