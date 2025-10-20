import { useEffect, useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

const protectedRoutes = ['/admin', '/editor', '/ads'];

const SideAds = () => {
  const [ads, setAds] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

  useEffect(() => {
    const fetchAds = async () => {
      const snapshot = await getDocs(collection(db, 'ads'));
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAds(docs);
    };
    fetchAds();
  }, []);

  if (protectedRoutes.some(route => location.pathname.startsWith(route))) return null;

  const getRandomAd = () => {
    if (ads.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * ads.length);
    return ads[randomIndex];
  };

  const leftAd = getRandomAd();
  const rightAd = getRandomAd();

  // ✅ Mobile: centrado sin overflow
  if (isMobile) {
    return rightAd ? (
      <Box
        sx={{
          width: '100%',
          mt: 4,
          mb: 2,
          display: 'flex',
          justifyContent: 'center',
          overflowX: 'hidden', 
        }}
      >
        <a href={rightAd.link} target="_blank" rel="noopener noreferrer">
          <img
            src={rightAd.image}
            alt="Publicidad"
            style={{
              width: '100%',
              maxWidth: 350,
              height: 'auto',
              borderRadius: 8,
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            }}
          />
        </a>
      </Box>
    ) : null;
  }

  // ✅ Desktop: igual que antes
  return (
    <>
      {leftAd && (
        <Box
          sx={{
            position: 'fixed',
            top: 65,
            left: 0,
            width: '13%',
            zIndex: 999,
          }}
        >
          <a href={leftAd.link} target="_blank" rel="noopener noreferrer">
            <img src={leftAd.image} alt="Publicidad" style={{ maxWidth: '100%' }} />
          </a>
        </Box>
      )}
      {rightAd && (
        <Box
          sx={{
            position: 'fixed',
            top: 65,
            right: 0,
            width: '13%',
            zIndex: 999,
          }}
        >
          <a href={rightAd.link} target="_blank" rel="noopener noreferrer">
            <img src={rightAd.image} alt="Publicidad" style={{ maxWidth: '100%' }} />
          </a>
        </Box>
      )}
    </>
  );
};

export default SideAds;
