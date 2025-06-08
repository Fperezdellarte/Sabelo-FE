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
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const MyComments = () => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchMyComments = async () => {
    if (!user) return;

    const newsQuery = query(
      collection(db, 'news'),
      where('userId', '==', user.uid)
    );
    const newsSnapshot = await getDocs(newsQuery);
    const newsIds = newsSnapshot.docs.map((doc) => doc.id);

    if (newsIds.length === 0) {
      setComments([]);
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
      commentsSnapshot.forEach((commentDoc) => {
        allComments.push({
          id: commentDoc.id,
          ...commentDoc.data()
        });
      });
    }

    const sorted = allComments.sort(
      (a, b) => b.createdAt?.seconds - a.createdAt?.seconds
    );
    setComments(sorted);
  };

  const deleteComment = async (commentId) => {
    await deleteDoc(doc(db, 'comments', commentId));
    fetchMyComments();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    fetchMyComments();
  }, []);

  const paginatedComments = comments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
          Panel de Comentarios
        </Typography>

        <Box sx={{ overflowX: 'auto' }}>
          <Table size={isMobile ? 'small' : 'medium'}>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Comentario</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedComments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell>{comment.user}</TableCell>
                  <TableCell>{comment.text || '—'}</TableCell>
                  <TableCell align="center">
                    <Button
                      color="error"
                      variant="outlined"
                      onClick={() => deleteComment(comment.id)}
                      size={isMobile ? 'small' : 'medium'}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        <TablePagination
          component="div"
          count={comments.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[rowsPerPage]}
        />
      </Box>
    </Container>
  );
};

export default MyComments;
