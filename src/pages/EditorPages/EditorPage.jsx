import {
  Box,
  Button,
  Typography,
  Grid,
  Paper,
  CardMedia,
  Stack,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../../config/firebase';

const EditorPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(true);

  const [latestNews, setLatestNews] = useState(null);
  const [latestComments, setLatestComments] = useState([]);

  useEffect(() => {
    const fetchLatestNews = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, 'news'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setLatestNews(querySnapshot.docs[0].data());
        } else {
          setLatestNews(null);
        }
      } catch (error) {
        console.error('Error fetching latest news:', error);
      } finally {
        setIsLoadingNews(false);
      }
    };

    const fetchLatestComments = async () => {
      if (!user) return;

      try {
        const newsQuery = query(
          collection(db, 'news'),
          where('userId', '==', user.uid)
        );
        const newsSnapshot = await getDocs(newsQuery);
        const newsIds = newsSnapshot.docs.map((doc) => doc.id);

        if (newsIds.length === 0) {
          setLatestComments([]);
          return;
        }

        const allComments = [];

        for (const newsId of newsIds) {
          const commentsQuery = query(
            collection(db, 'comments'),
            where('newsId', '==', newsId),
            orderBy('createdAt', 'desc')
          );
          const commentsSnapshot = await getDocs(commentsQuery);
          commentsSnapshot.forEach((doc) => {
            allComments.push(doc.data());
          });
        }

        const sorted = allComments
          .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
          .slice(0, 1);

        setLatestComments(sorted);
      } catch (error) {
        console.error('Error fetching latest comments:', error);
      } finally {
        setIsLoadingComments(false);
      }
    };

    fetchLatestNews();
    fetchLatestComments();
  }, [user]);

  return (
    <Box
      sx={{
        p: 4,
        mx: 'auto',
        mt: 4,
        backgroundColor: 'rgba(236, 252, 249, 0.7)',
        borderRadius: 2,
        pb: '10rem',
        maxWidth: '1600px',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Panel del Editor
      </Typography>

      <Grid container spacing={4} justifyContent="center" sx={{ mt: 5 }}>
        {/* Última noticia */}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 5, sm: 5, md: 5, lg: 5, xl: 0 } }}>
          <Box sx={{ maxWidth: 500, width: '100%' }}>
            <Paper elevation={3} sx={{ p: 3, height: '100%', position: 'relative', overflow: 'hidden' }}>
              {isLoadingNews ? (
                <Typography variant="body1"> <CircularProgress sx={{ color: 'black' }} />Cargando última noticia...</Typography>
              ) : latestNews ? (
                <>
                  <CardMedia
                    component="img"
                    image={latestNews.image}
                    alt="Última noticia"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0.3,
                      objectFit: 'cover',
                    }}
                  />
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      Última noticia
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <Box
                        sx={{
                          fontSize: '0.9rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          '& *': {
                            fontSize: 'inherit !important',
                          },
                        }}
                        dangerouslySetInnerHTML={{ __html: latestNews.title }}
                      />
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate('/editor/my-news')}
                    >
                      Ver todas las noticias
                    </Button>
                  </Box>
                </>
              ) : (
                <Typography variant="body1">No tienes noticias aún.</Typography>
              )}
            </Paper>
          </Box>
        </Grid>

        {/* Últimos comentarios */}
        <Grid item xs={12} md={6} sx={{ mb: { xs: 5, sm: 5, md: 5, lg: 5, xl: 0 } }}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Últimos comentarios
            </Typography>
            {isLoadingComments ? (
              <Typography variant="body1"><CircularProgress sx={{ color: 'black' }} />Cargando comentarios...</Typography>
            ) : latestComments.length > 0 ? (
              <Stack spacing={2} sx={{ mb: 2 }}>
                {latestComments.map((comment, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      backgroundColor: 'rgba(250, 252, 236, 0.7)',
                      border: '1px solid rgba(128, 128, 128, 0.1)',
                      borderRadius: '5px',
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">
                      {comment.user}
                    </Typography>
                    <Typography mb={1} pl={1}>
                      {comment.text}
                    </Typography>
                  </Box>
                ))}
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate('/editor/my-comments')}
                >
                  Ver comentarios
                </Button>
              </Stack>
            ) : (
              <Typography variant="body1">No tienes comentarios aún.</Typography>
            )}
          </Paper>
        </Grid>

        {/* Subir noticia */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Subir nueva noticia
            </Typography>
            <Typography variant="body1" gutterBottom>
              Crea una nueva noticia para compartir con los lectores.
            </Typography>
            <Button
              variant="contained"
              color="success"
              onClick={() => navigate('/editor/update-news')}
            >
              Subir noticia
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditorPage;
