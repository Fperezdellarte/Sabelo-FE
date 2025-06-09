import { useEffect, useState } from 'react';
import { db } from '../../config/firebase'; 
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
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
  Switch,
  TablePagination,
  Box,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const rowsPerPage = 5;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const userList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setUsers(userList);
  };

  const toggleAdmin = async (userId, currentValue) => {
    await updateDoc(doc(db, 'users', userId), {
      admin: !currentValue
    });
    fetchUsers();
  };

  const toggleEditor = async (userId, currentValue) => {
    await updateDoc(doc(db, 'users', userId), {
      editor: !currentValue
    });
    fetchUsers();
  };

    const toggleMarketing = async (userId, currentValue) => {
    await updateDoc(doc(db, 'users', userId), {
      marketing: !currentValue
    });
    fetchUsers();
  };

  const deleteUser = async (userId) => {
    await deleteDoc(doc(db, 'users', userId));
    fetchUsers();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const paginatedUsers = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
          Panel de administración
        </Typography>

        {/* Tabla con scroll en pantallas chicas */}
        <Box sx={{ overflowX: 'auto' }}>
          <Table size={isMobile ? 'small' : 'medium'}>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Admin</TableCell>
                <TableCell>Editor</TableCell>
                <TableCell>Marketing</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.name || '—'}</TableCell>
                  <TableCell>
                    <Switch
                      checked={user.admin || false}
                      onChange={() => toggleAdmin(user.id, user.admin)}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={user.editor || false}
                      onChange={() => toggleEditor(user.id, user.editor)}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={user.marketing || false}
                      onChange={() => toggleMarketing(user.id, user.marketing)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      color="error"
                      onClick={() => deleteUser(user.id)}
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

        {/* Paginación */}
        <TablePagination
          component="div"
          count={users.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[rowsPerPage]}
        />
        <Box sx={{ display: 'flex', justifyContent: isMobile ? 'center' : 'flex-end', mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/admin/news')}
            size={isMobile ? 'medium' : 'large'}
          >
            Administrar noticias
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AdminPage;
