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
  Grid,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { db } from '../config/firebase';
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
import { uploadToCloudinary } from '../utils/uploadToCloudinary';

const AdsManager = () => {
  const [link, setLink] = useState('');
  const [image, setImage] = useState(null);
  const [ads, setAds] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchAds = async () => {
    const q = query(collection(db, 'ads'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    setAds(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

const handleUpload = async () => {
  if (!image || !link) return alert('Faltan campos');
  const uploadedImage = await uploadToCloudinary(image);
  await addDoc(collection(db, 'ads'), {
    image: uploadedImage,
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
    <Container sx={{ mt: 10, backgroundColor: '#f5f5f5', padding: 4, borderRadius: 2, mb: 10, width: { xs: '90%'}}}>
      <Typography variant="h4" gutterBottom>
        Gestión de Publicidades
      </Typography>

        <TextField
          label="Link de la publicidad"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          fullWidth
        />
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
        <Button
          variant="contained"
          component="label"
          sx={{ width: { xs: '100%', sm: '40%'}, p: 1 }}
        >
          Subir imagen
          <input type="file" hidden accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        </Button>
      </Box>

      {image && (
        <Typography align="center">{image.name}</Typography>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          sx={{ width: { xs: '100%', sm: '40%'}, p: 1 }}
        >
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
                  <Button size="small" >Ver enlace</Button>
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
