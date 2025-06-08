import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Grid } from '@mui/material';
import NewsCard from '../components/NewsCard';
import logohome from '../assets/logohome.png'; // Imagen principal
import { getNoticias } from '../services/api'; // Suponiendo que vas a traerlas así

function Home() {
  const [noticias, setNoticias] = useState([]);

  useEffect(() => {
    // Luego lo conectamos con la API real
    getNoticias().then(data => setNoticias(data));
  }, []);
  const [news, setNews] = useState([]);

  useEffect(() => { 
    axios.get('http://localhost:3001/api/news')
      .then((res) => {
        setNews(res.data);
      })
      .catch((err) => {
        console.error('Error fetching news:', err);
      });
  }, []);

  return (
    <>

      {/* Imagen principal */}
      <Box sx={{ width: '100%', textAlign: 'center', mt: 2 }}>
        <Box
          component="img"
          src={logohome}
          alt="Imagen principal"
          sx={{ width: '100%', maxWidth: {xl:'1200px', lg: "800px", md:"500px", xs:"300px" }, height: 'auto', mt: 8}}
        />
      </Box>

      {/* Grid de noticias */}
      <Box sx={{ p: 4 }}>
      <Grid container spacing={3} justifyContent="center">
        {news.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.id}>
            <NewsCard id={item.id} title={item.title} image={item.image} />
          </Grid>
        ))}
      </Grid>
      </Box>
    </>
  );
}

export default Home;
