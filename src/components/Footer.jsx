import { Box, Grid, Typography, Link, IconButton } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';    

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#111',
        color: '#ccc',
        fontSize: '0.9rem',
        pt: 3,
        pb: 2,
        mt: 4,
      }}
    >
      {/* Íconos sociales */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 3,
          mb: 2,
        }}
      >
        <IconButton
          component="a"
          href="https://www.instagram.com/sabelodeportivamente/"
          target="_blank"
          rel="noopener"
          sx={{
            width: 40,
            height: 40,
            transition: 'transform 0.3s ease, filter 0.3s ease',
            '&:hover': {
              transform: 'scale(1.2)',
              filter: 'brightness(1.5)',
            },
          }}
        >
          <InstagramIcon sx={{ color: '#ccc' }} />
        </IconButton>

        <IconButton
          component="a"
          href="https://x.com/SDeportivamente"
          target="_blank"
          rel="noopener"
          sx={{
            width: 40,
            height: 40,
            transition: 'transform 0.3s ease, filter 0.3s ease',
            '&:hover': {
              transform: 'scale(1.2)',
              filter: 'brightness(1.5)',
            },
          }}
        >
          <TwitterIcon sx={{ color: '#ccc' }} />
        </IconButton>
        
        <IconButton
          component="a"
          href="https://www.youtube.com/@sabelodeportivamente"
          target="_blank"
          rel="noopener"
          sx={{
            width: 40,
            height: 40,
            transition: 'transform 0.3s ease, filter 0.3s ease',
            '&:hover': {
              transform: 'scale(1.2)',
              filter: 'brightness(1.5)',
            },
          }}
        >
          <YouTubeIcon sx={{ color: '#ccc' }} />
        </IconButton>

        <IconButton
          component="a"
          href="https://www.facebook.com/Sabelodeportivamente"
          target="_blank"
          rel="noopener"
          sx={{
            width: 40,
            height: 40,
            transition: 'transform 0.3s ease, filter 0.3s ease',
            '&:hover': {
              transform: 'scale(1.2)',
              filter: 'brightness(1.5)',
            },
          }}
        >
          <FacebookIcon sx={{ color: '#ccc' }} />
        </IconButton>

      </Box>

      {/* Información de contacto */}
      <Grid container justifyContent="center">
        <Grid item xs={12} md={6}>
          <Typography
            variant="h6"
            align="center"
            sx={{ fontSize: '1rem', mb: 1, fontWeight: 'bold', color: '#fff' }}
          >
            Contáctanos
          </Typography>
          <Typography align="center">sabelodeportivamente@gmail.com</Typography>
          <Typography align="center">+54 381 443-1244 | +54 381 2345-678</Typography>
        </Grid>
      </Grid>

      {/* Copyright */}
      <Box
        mt={4}
        textAlign="center"
        sx={{
          color: '#6c757d',
          py: 1,
          fontSize: '0.75rem',
        }}
      >
        © 2025 Copyright:{' '}
        <Link
          href="/"
          underline="hover"
          sx={{
            color: '#6c757d',
            fontWeight: 'bold',
            '&:hover': {
              color: '#343a40',
              textDecoration: 'underline',
            },
          }}
        >
          Sabelo Deportivamente
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;
