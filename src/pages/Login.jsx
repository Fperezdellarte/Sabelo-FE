import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Fade,
  Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import {Link, useNavigate } from 'react-router-dom';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const LoginBox = styled(Paper)(({ theme }) => ({
  width: '80%',
  maxWidth: 300,
  padding: theme.spacing(8),
  backgroundColor: 'rgba(255, 255, 255, 0.6)',
  backdropFilter: 'blur(8px)',
  borderRadius: '20px',
  border: '2px solid rgba(0, 0, 0, 0.1)',
  boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.15)',
  transition: 'box-shadow 0.8s ease-in-out, transform 0.8s ease-in-out',
  willChange: 'transform, box-shadow',
  transformStyle: 'preserve-3d',

  '&:hover': {
    boxShadow: '0px 12px 30px rgba(0, 0, 0, 0.25)',
    transform: 'translateY(-4px)',
  },
}));

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      navigate('/'); // redirigir al home o dashboard
    } catch (err) {
      console.error(err);
      setError('Email o contraseña incorrectos.');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="85vh">
      <Fade in timeout={600}>
        <LoginBox elevation={5}>
          <Typography variant="h5" gutterBottom textAlign="center" style={{ marginBottom: '2rem' }}>
            Iniciar sesión
          </Typography>

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email"
              placeholder="ejemplo@correo.com"
              margin="normal"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.68)' }}
            />
            <TextField
              fullWidth
              label="Contraseña"
              placeholder="Tu contraseña"
              margin="normal"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.68)' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {error && (
              <Typography color="error" variant="body2" mt={1}>
                {error}
              </Typography>
            )}
            <Box mt={2} textAlign="center">
              <Typography variant="body2">
                <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2' }}>
                
                ¿No tenés una cuenta?
                </Link>
              </Typography>
            </Box>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
              Iniciar sesión
            </Button>
          </form>
        </LoginBox>
      </Fade>
    </Box>
  );
};

export default Login;
