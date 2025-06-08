import React from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';

const About = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, mt: 8 }}>
      <Grid
        container
        spacing={30}
        justifyContent="center"
        alignItems="flex-start"
      >
        {/* Info */}
        <Grid item xs={12} md={6} sx={{ width: {md:"40%", xs:"80%" } }}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              bgcolor: 'rgba(255,255,255,0.4)',
              borderRadius: 2,
              boxShadow: 3,
              width: isSmall ? '80%' : '100%',
            }}
          >
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Sobre Sabelo Deportivamente
            </Typography>
            <Typography>
              Sabelo Deportivamente es un portal de noticias deportivas originado
              desde la pasión de la radio tucumana. Brindamos información veraz y
              actualizada sobre todo el deporte local, nacional e internacional.
            </Typography>
          </Paper>
        </Grid>

        {/* Formulario de contacto */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              bgcolor: 'rgba(255,255,255,0.4)',
              borderRadius: 2,
              boxShadow: 3,
              width: isSmall ? '80%' : '100%',
            }}
          >
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Contáctanos
            </Typography>
            <Box
              component="form"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                mt: 2,
              }}
            >
              <TextField
                type="email"
                label="Tu correo *"
                variant="outlined"
                required
                fullWidth
                InputProps={{
                  sx: { bgcolor: '#fff8dc'},
                }}
              />
              <TextField
                label="Tu mensaje *"
                variant="outlined"
                required
                fullWidth
                multiline
                rows={4}
                InputProps={{
                  sx: { bgcolor: '#fff8dc' },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: '#007bff',
                  '&:hover': {
                    bgcolor: '#0056b3',
                  },
                  borderRadius: 2,
                  p: 1.5,
                  mt: 1,
                }}
              >
                ENVIAR MENSAJE
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default About;
