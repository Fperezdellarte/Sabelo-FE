import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/logonavbar.jpeg';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import CircularProgress from '@mui/material/CircularProgress';
import EditUserModal from './EditUserModal';

function Navbar() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  if (loading) {
    return (
      <AppBar position="static" sx={{ backgroundColor: '#000' }}>
        <Toolbar sx={{ justifyContent: 'center' }}>
          <CircularProgress sx={{ color: 'white' }} />
        </Toolbar>
      </AppBar>
    );
  }

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const navItems = [
    { label: 'Inicio', path: '/' },
    { label: 'Nosotros', path: '/about' },
    { label: 'Radio', href: 'https://radiotucuman.com.ar/envivo/' },
    user?.admin && { label: 'Admin', path: '/admin' },
    user?.marketing && { label: 'Anuncios', path: '/ads' },
    user?.editor && { label: 'Editor', path: '/editor' }
  ].filter(Boolean);

  const authItems = !user
    ? [
        { label: 'Iniciar Sesión', path: '/login' },
        { label: 'Crear Cuenta', path: '/register' }
      ]
    : [];

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#000' }}>
        <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo + navegación */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <img src={Logo} alt="Logo" style={{ height: '40px', marginRight: 16 }} />
            </Link>

            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 2 }}>
                {navItems.map(({ label, path, href }) =>
                  href ? (
                    <Button
                      key={label}
                      component="a"
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}
                    >
                      {label}
                    </Button>
                  ) : (
                    <Button
                      key={label}
                      component={Link}
                      to={path}
                      sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}
                    >
                      {label}
                    </Button>
                  )
                )}
              </Box>
            )}
          </Box>

          {/* Botones de sesión o menú móvil */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, padding: '0 16px' }}>
            {isMobile ? (
              <>
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleMenuOpen}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      backgroundColor: '#000',
                      color: 'white'
                    }
                  }}
                >
                  {navItems.map(({ label, path, href }) =>
                    href ? (
                      <MenuItem
                        key={label}
                        component="a"
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleMenuClose}
                        sx={{ color: 'white' }}
                      >
                        {label}
                      </MenuItem>
                    ) : (
                      <MenuItem
                        key={label}
                        component={Link}
                        to={path}
                        onClick={handleMenuClose}
                        sx={{ color: 'white' }}
                      >
                        {label}
                      </MenuItem>
                    )
                  )}
                  {authItems.map(({ label, path }) => (
                    <MenuItem
                      key={label}
                      component={Link}
                      to={path}
                      onClick={handleMenuClose}
                      sx={{ color: 'white' }}
                    >
                      {label}
                    </MenuItem>
                  ))}
                  {user && (
                    <>
                      <MenuItem
                        onClick={() => {
                          handleLogout();
                          handleMenuClose();
                        }}
                        sx={{ color: 'white' }}
                      >
                        Cerrar sesión
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleMenuClose();
                          setOpenModal(true);
                        }}
                        sx={{
                          color: 'white',
                          textDecoration: 'underline',
                          cursor: 'pointer'
                        }}
                      >
                        Hola, {user.name}
                      </MenuItem>
                    </>
                  )}
                </Menu>
              </>
            ) : (
              <>
                {user ? (
                  <>
                    <Typography
                      sx={{
                        backgroundColor: '#000',
                        color: 'white',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                      onClick={() => setOpenModal(true)}
                    >
                      Hola, {user.name}
                    </Typography>
                    <Button
                      onClick={handleLogout}
                      sx={{ backgroundColor: '#000', color: 'white' }}
                    >
                      Cerrar sesión
                    </Button>
                  </>
                ) : (
                  authItems.map(({ label, path }) => (
                    <Button
                      key={label}
                      component={Link}
                      to={path}
                      sx={{ backgroundColor: '#000', color: 'white' }}
                    >
                      {label}
                    </Button>
                  ))
                )}
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <EditUserModal open={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
}

export default Navbar;
