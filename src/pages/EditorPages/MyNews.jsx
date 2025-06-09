import { useEffect, useState } from 'react';
import { db } from '../../config/firebase';
import {
  collection,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  doc
} from 'firebase/firestore';
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TablePagination,
  Box,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MyNews = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [news, setNews] = useState([]);
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchMyNews = async () => {
    if (!user) return;

    const q = query(
      collection(db, 'news'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const newsList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    setNews(newsList);
  };

 const deleteNews = async (newsId) => {
  try {
    const commentsRef = collection(db, 'comments');
    const q = query(commentsRef, where('newsId', '==', newsId));
    const commentsSnapshot = await getDocs(q);

    const deletePromises = commentsSnapshot.docs.map(commentDoc =>
      deleteDoc(doc(db, 'comments', commentDoc.id))
    );
    await Promise.all(deletePromises);

    await deleteDoc(doc(db, 'news', newsId));

    fetchMyNews();
  } catch (error) {
    console.error('Error eliminando noticia y comentarios:', error);
  }
};

  const editNews = (newsId) => {
    navigate(`/editor/edit-news/${newsId}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    fetchMyNews();
  }, []);

  const paginatedNews = news.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 5 }}>
      <Box
        sx={{
          backgroundColor: '#fff',
          padding: { xs: 2, sm: 3 },
          borderRadius: 2,
          boxShadow: 3
        }}
      >
        <Typography variant="h4" gutterBottom>
          Mis Noticias
        </Typography>

        <Box sx={{ overflowX: 'auto' }}>
          <Table size={isMobile ? 'small' : 'medium'}>
            <TableHead>
              <TableRow>
                <TableCell align="center">Imagen</TableCell>
                <TableCell align="center">Título</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedNews.map(newsItem => (
                <TableRow key={newsItem.id}>
                  <TableCell align="center">
                    {newsItem.image ? (
                      <Box
                        component="img"
                        src={newsItem.image}
                        alt="noticia"
                        sx={{
                          width: { xs: 80, sm: 100 },
                          height: 'auto',
                          borderRadius: 1
                        }}
                      />
                    ) : '—'}
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        fontSize: '0.9rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        '& *': {
                          fontSize: 'inherit !important',
                        },
                      }}
                      dangerouslySetInnerHTML={{ __html: newsItem.title }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Button
                        color="primary"
                        variant="outlined"
                        onClick={() => editNews(newsItem.id)}
                        size={isMobile ? 'small' : 'medium'}
                      >
                        Editar
                      </Button>
                      <Button
                        color="error"
                        variant="outlined"
                        onClick={() => deleteNews(newsItem.id)}
                        size={isMobile ? 'small' : 'medium'}
                      >
                        Eliminar
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        <TablePagination
          component="div"
          count={news.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[rowsPerPage]}
        />
        <Box sx={{ display: 'flex', justifyContent: isMobile ? 'center' : 'flex-end', mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/editor')}
            size={isMobile ? 'medium' : 'large'}
          >
            Volver a Editor
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default MyNews;
