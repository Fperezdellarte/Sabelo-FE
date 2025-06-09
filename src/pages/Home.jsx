import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Grid, Typography, CircularProgress } from '@mui/material';
import NewsCard from '../components/NewsCard';
import logohome from '../assets/logohome.png';

function Home() {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3001/api/news')
      .then((res) => {
        setNews(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching news:', err);
        setIsLoading(false);
      });
  }, []);

  const categories = ['futbol', 'basquet', 'rugby', 'otros'];

  const groupedNews = categories.reduce((acc, cat) => {
    acc[cat] = news.filter(n => {
      if (cat === 'otros') {
        return !['futbol', 'basquet', 'rugby'].includes(n.category?.toLowerCase());
      }
      return n.category?.toLowerCase() === cat;
    });
    return acc;
  }, {});

  return (
    <>
      <Box sx={{ width: '100%', textAlign: 'center', mt: 2 }}>
        <Box
          component="img"
          src={logohome}
          alt="Imagen principal"
          sx={{ width: '100%', maxWidth: { xl: '1200px', lg: "800px", md: "500px", xs: "300px" }, height: 'auto', mt: 8 }}
        />
      </Box>

      <Box sx={{ p: 4, ml: {lg: 30, sx: 0} }}>
        {isLoading ? (
          <Typography variant="h6" align="center" color='white'>
            <CircularProgress sx={{ color: 'white' }} /> Cargando noticias...
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {categories.map((cat) => (
              <Grid item xs={12} md={3} key={cat} sx={{ backgroundColor: 'rgba(22, 105, 101, 0.2)', borderRadius: 2, p: 2, mb: 2, maxWidth: {md:'20%'} }}>
                <Typography variant="h6" align="center" sx={{ mb: 2, textTransform: 'capitalize', color: 'white' }}>
                  {cat}
                </Typography>
                {groupedNews[cat].map((item) => (
                  <Box key={item.id} sx={{ mb: 2 }}>
                    <NewsCard id={item.id} title={item.title} image={item.image} />
                  </Box>
                ))}
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </>
  );
}

export default Home;
