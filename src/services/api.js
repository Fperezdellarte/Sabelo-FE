import axios from 'axios';

const API_URL = 'https://sabelo-be.onrender.com/api'; 

export const getNoticias = async () => {
  try {
    const res = await axios.get(`${API_URL}/noticias`);
    return res.data;
  } catch (err) {
    console.error('Error al obtener noticias:', err);
    return [];
  }
};
