import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Button,
  Fade,
  Divider,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Close as CloseIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { updatePassword } from 'firebase/auth';
import { uploadToCloudinary } from '../utils/uploadToCloudinary';
import { useAuth } from '../context/AuthContext';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 420,
  bgcolor: 'rgba(255, 255, 255, 0.71)',
  borderRadius: '16px',
  boxShadow: '0px 8px 24px rgba(0,0,0,0.2)',
  backdropFilter: 'blur(10px)',
  p: 4,
};

const EditUserModal = ({ open, onClose }) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState('');
  const [preview, setPreview] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhoto(user.photoURL || '');
      setPreview(user.photoURL || '');
    }
  }, [user]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setPhoto(file);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      let uploadedPhoto = user.photoURL;

      if (photo instanceof File) {
        uploadedPhoto = await uploadToCloudinary(photo);
      }

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { name, photoURL: uploadedPhoto });

      if (newPassword.length >= 8) {
        await updatePassword(auth.currentUser, newPassword);
      }

      setSuccessMsg('Datos actualizados correctamente ✅');
      setTimeout(() => {
        setLoading(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error al actualizar:', error);
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} closeAfterTransition>
      <Fade in={open}>
        <Box sx={style}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="bold">
              Editar Perfil
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Avatar
              src={preview}
              alt="Foto del usuario"
              sx={{ width: 90, height: 90, mb: 1, boxShadow: 2 }}
            />

            <Button variant="outlined" component="label" sx={{ textTransform: 'none' }}>
              Cambiar foto
              <input type="file" accept="image/*" hidden onChange={handleFileChange} />
            </Button>

            <TextField
              fullWidth
              label="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: 1,
              }}
            />

            <TextField
              fullWidth
              label="Nueva contraseña"
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Dejar vacío si no querés cambiarla"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: 1,
              }}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />

            {successMsg && (
              <Typography color="success.main" fontSize={14}>
                {successMsg}
              </Typography>
            )}

            <LoadingButton
              onClick={handleSave}
              variant="contained"
              loading={loading}
              fullWidth
              sx={{
                mt: 2,
                backgroundColor: '#000',
                color: '#fff',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#222',
                },
              }}
            >
              Guardar cambios
            </LoadingButton>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default EditUserModal;
