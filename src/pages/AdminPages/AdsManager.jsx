// src/pages/admin/AdsManager.jsx
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  Card,
  CardMedia,
  CardActions,
  IconButton,
  Grid
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { db } from '../../config/firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
  query
} from 'firebase/firestore';
import { uploadToCloudinary } from '../../utils/cloudinary';

const AdsManager = () => {
  const [link, setLink] = useState('');
  const [image, setImage] = useState(null);
  const [ads, setAds] = useState([]);

  const fetchAds = async () => {
    const q = query(collection(db, 'ads'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    setAds(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleUpload = async () => {
    if (!image || !link) return alert('Faltan campos');
    const image = await uploadToCloudinary(image);
    await addDoc(collection(db, 'ads'), {
      image,
      link,
      createdAt: serverTimestamp(),
    });
    setImage(null);
    setLink('');
    fetchAds();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'ads', id));
    fetchAds();
  };

  useEffect(() => {
    fetchAds();
  }, []);

  return (
    <Container sx={{ mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Publicidades
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
        <TextField
          label="Link de la publicidad"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          fullWidth
        />
        <Button variant="contained" component="label">
          Subir imagen
          <input type="file" hidden accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        </Button>
        {image && <Typography>{image.name}</Typography>}
        <Button variant="contained" color="primary" onClick={handleUpload}>
          Guardar publicidad
        </Button>
      </Box>

      <Grid container spacing={2}>
        {ads.map(ad => (
          <Grid item xs={12} sm={6} md={4} key={ad.id}>
            <Card>
              <CardMedia
                component="img"
                height="180"
                image={ad.image}
                alt="Publicidad"
              />
              <CardActions>
                <a href={ad.link} target="_blank" rel="noopener noreferrer">
                  <Button size="small">Ver enlace</Button>
                </a>
                <IconButton color="error" onClick={() => handleDelete(ad.id)}>
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AdsManager;
