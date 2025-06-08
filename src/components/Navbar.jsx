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

function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const navItems = [
    { label: 'Inicio', path: '/' },
    { label: 'Nosotros', path: '/about' },
    user?.admin && { label: 'Admin', path: '/admin' },
    user?.editor && { label: 'Editor', path: '/editor' }
  ].filter(Boolean);

  const authItems = !user
    ? [
        { label: 'Iniciar Sesión', path: '/login' },
        { label: 'Crear Cuenta', path: '/register' }
      ]
    : [];

  return (
    <AppBar position="static" sx={{ backgroundColor: '#000',}}>
      <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <img src={Logo} alt="Logo" style={{ height: '40px', marginRight: 16 }} />
          </Link>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2}}>
              {navItems.map(({ label, path }) => (
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
              ))}
            </Box>
          )}
        </Box>

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
                {navItems.map(({ label, path }) => (
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
                      onClick={() => { handleLogout(); handleMenuClose(); }}
                      sx={{ color: 'white' }}
                    >
                      Cerrar sesión
                    </MenuItem>
                    <MenuItem disabled sx={{ color: 'white' }}>
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
                  <Typography sx={{ backgroundColor: '#000', color: 'white' }}>
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
  );
}

export default Navbar;
