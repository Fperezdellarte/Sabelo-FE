import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Fade,
  Paper,
  IconButton,
  InputAdornment
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { Visibility, VisibilityOff } from '@mui/icons-material';

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
  margin: '5%',
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
    photo: null,
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = () => {
    let valid = true;
    let tempErrors = {};

    if (!form.email.includes('@')) {
      valid = false;
      tempErrors.email = 'Email inválido o en uso';
    }

    if (!/^[a-zA-Z áéíóúÁÉÍÓÚñÑ\s]+$/.test(form.name)) {
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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, photo: file });
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const uploadPhotoToCloudinary = async (file) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
    data.append('folder', process.env.REACT_APP_CLOUDINARY_FOLDER);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: data,
    });
    const result = await res.json();
    return result.secure_url;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setLoading(true);

    if (!validate()) {
      setLoading(false);
      return;
    }

    try {
      let photoURL = null;
      if (form.photo) {
        photoURL = await uploadPhotoToCloudinary(form.photo);
      }

      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        name: form.name,
        email: form.email,
        admin: false,
        editor: false,
        photoURL: photoURL || null,
        createdAt: new Date(),
      });

      setSuccessMsg('¡Registro exitoso!');
      setForm({
        email: '',
        name: '',
        password: '',
        confirmPassword: '',
        photo: null,
      });
      setPhotoPreview(null);

      setTimeout(() => {
        navigate('/login');
      }, 1500);
      setErrors({});
      setLoading(false);
    } catch (error) {
      console.error(error);
      setErrors({ firebase: error.message });
      setLoading(false);
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
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={!!errors.password}
              helperText={errors.password}
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
            <TextField
              fullWidth
              label="Repetir Contraseña"
              placeholder="Las contraseñas deben coincidir"
              margin="normal"
              type={showConfirmPassword ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.68)' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword((prev) => !prev)} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
              <Box mt={2} textAlign="center">
                <Button variant="outlined" component="label">
                  {form.photo ? 'Cambiar foto' : 'Subir foto de perfil'}
                  <input hidden accept="image/*" type="file" onChange={handlePhotoChange} />
                </Button>
                {photoPreview && (
                  <Box mt={2}>
                    <img
                      src={photoPreview}
                      alt="Preview"
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                )}
              </Box>

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

            <LoadingButton type="submit" fullWidth variant="contained" sx={{ mt: 3 }} loading={loading}>
              Registrarse
            </LoadingButton>
          </form>
        </RegisterBox>
      </Fade>
    </Box>
  );
};

export default Register;
