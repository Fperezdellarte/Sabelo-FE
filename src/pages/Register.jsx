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
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { Link, useNavigate } from 'react-router-dom';

// ⬇️ Estilo personalizado que ya tenías
const RegisterBox = styled(Paper)(({ theme }) => ({
  width: '80%',
  maxWidth: 400,
  padding: theme.spacing(8),
  backgroundColor: 'rgba(255, 255, 255, 0.6)',
  backdropFilter: 'blur(8px)',
  borderRadius: '20px',
  border: '2px solid rgba(0, 0, 0, 0.1)',
  boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.15)',
  transition: 'box-shadow 0.8s ease-in-out, transform 0.8s ease-in-out',
  willChange: 'transform, box-shadow',
  transformStyle: 'preserve-3d',
  margin: "5%",

  '&:hover': {
    boxShadow: '0px 12px 30px rgba(0, 0, 0, 0.25)',
    transform: 'translateY(-4px)',
  },
}));



const Register = () => {
  const [form, setForm] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    let valid = true;
    let tempErrors = {};

    if (!form.email.includes('@')) {
      valid = false;
      tempErrors.email = 'Email inválido o en uso';
    }

    if (!/^[a-zA-Z\s]+$/.test(form.name)) {
      valid = false;
      tempErrors.name = 'Solo se permiten letras';
    }

    if (form.password.length < 8 || !/[A-Z]/.test(form.password)) {
      valid = false;
      tempErrors.password = 'Mínimo 8 caracteres y 1 mayúscula';
    }

    if (form.password !== form.confirmPassword) {
      valid = false;
      tempErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(tempErrors);
    return valid;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    if (!validate()) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        name: form.name,
        email: form.email,
        admin: false,
        editor: false,
        createdAt: new Date()
      });

      setSuccessMsg('¡Registro exitoso!');
      setForm({
        email: '',
        name: '',
        password: '',
        confirmPassword: '',
      });
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      setErrors({});
    } catch (error) {
      console.error(error);
      setErrors({ firebase: error.message }); //cambiar por un mensaje entendible
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="85vh">
      <Fade in timeout={600}>
        <RegisterBox elevation={5}>
          <Typography variant="h5" gutterBottom textAlign="center">
            Crear cuenta
          </Typography>

          <form onSubmit={handleRegister} noValidate>
            <TextField
              fullWidth
              label="Email"
              placeholder="ejemplo@correo.com"
              margin="normal"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={!!errors.email}
              helperText={errors.email}
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.68)' }}
            />
            <TextField
              fullWidth
              label="Nombre"
              placeholder="Juan Pérez"
              margin="normal"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={!!errors.name}
              helperText={errors.name}
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.68)' }}
              
            />
            <TextField
              fullWidth
              label="Contraseña"
              placeholder="Mínimo 8 caracteres, 1 mayúscula"
              margin="normal"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={!!errors.password}
              helperText={errors.password}
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.68)' }}
            />
            <TextField
              fullWidth
              label="Repetir Contraseña"
              placeholder="Las contraseñas deben coincidir" 
              margin="normal"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.68)' }}
            />

            {errors.firebase && (
              <Typography color="error" variant="body2" mt={1}>
                {errors.firebase}
              </Typography>
            )}
            {successMsg && (
              <Typography color="success.main" variant="body2" mt={2} textAlign="center">
                {successMsg}
              </Typography>
            )}
            <Box mt={2} textAlign="center">
              <Typography variant="body2">
                <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
                ¿Ya tenés una cuenta?{' '}
                </Link>
              </Typography>
            </Box>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
              Registrarse
            </Button>
          </form>
        </RegisterBox>
      </Fade>
    </Box>
  );
};

export default Register;
