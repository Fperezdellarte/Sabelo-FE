import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  useMediaQuery,
  useTheme,
  Fab,
  Drawer,
  IconButton
} from '@mui/material';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { ResizableImage } from '../../extensions/ResizableImage';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import Placeholder from '@tiptap/extension-placeholder';
import { FontSize } from '../../extensions/FontSize';
import Toolbar from '../../components/EditorToolbar';
import { db } from '../../config/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import Underline from '@tiptap/extension-underline';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const UpdateNews = () => {
  const [title, setTitle] = useState('');
  const [mainImage, setMainImage] = useState(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeEditor, setActiveEditor] = useState(null); 

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: 'Escribe el contenido de tu noticia aquí...',
      }),
      ResizableImage,
      TextStyle,
      FontFamily,
      FontSize,
    ],
    content: '',
  });

  const titleEditor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontFamily,
      FontSize,
      Underline,
      Placeholder.configure({
        placeholder: 'Escribe el título aquí...',
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setTitle(editor.getHTML());
    },
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
    }
  };

  const handleSave = async () => {
    if (!title || !editor || !editor.getHTML()) {
      alert("Por favor completá todos los campos.");
      return;
    }
    setLoading(true);

    try {
      let image = '';

      if (mainImage instanceof File) {
        const formData = new FormData();
        formData.append('file', mainImage);
        formData.append('upload_preset', 'sabelo_upload');
        formData.append('folder', 'news');

        const res = await fetch('https://api.cloudinary.com/v1_1/dmhzoafnw/image/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        image = data.secure_url;
      } else if (typeof mainImage === 'string') {
        image = mainImage;
      }

      const content = editor.getHTML();

      await addDoc(collection(db, 'news'), {
        title,
        content,
        image,
        createdAt: Timestamp.now(),
        userId: user?.uid || 'anónimo',
      });

      alert("Noticia publicada con éxito");
      setTitle('');
      setMainImage(null);
      editor.commands.clearContent();
      titleEditor.commands.clearContent();
      navigate('/');
    } catch (error) {
      console.error("Error al publicar la noticia:", error);
      alert("Hubo un error al subir la noticia.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'center',
          alignItems: 'flex-start',
          mt: 4,
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            mt: 5,
            backgroundColor: 'rgba(236, 252, 249, 1)',
            padding: 3,
            borderRadius: 2,
            marginLeft: isMobile ? 0 : '5rem',
            marginRight: isMobile ? 0 : '5rem',
            width: isMobile ? '100%' : '50%',
          }}
        >
          <Typography variant="h4" gutterBottom>
            Crear nueva noticia
          </Typography>
          <Box sx={{ width: '100%', pr: 2 }}>
            <Stack spacing={3}>
              <Box
                sx={{
                  fontSize: 18,
                  border: '1px solid #ccc',
                  borderRadius: 2,
                  pl: 2,
                  minHeight: 40,
                  backgroundColor: 'transparent',
                }}
              >
                <EditorContent
                  editor={titleEditor}
                  onFocus={() => setActiveEditor(titleEditor)}
                />
              </Box>

              <Button variant="contained" component="label">
                Subir imagen destacada
                <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
              </Button>

              {mainImage && (
                <Box
                  component="img"
                  src={mainImage instanceof File ? URL.createObjectURL(mainImage) : mainImage}
                  alt="Vista previa"
                  sx={{ width: '100%', borderRadius: 2, opacity: 0.8 }}
                />
              )}

              <Box
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: 2,
                  p: 2,
                  minHeight: 300,
                }}
              >
                <EditorContent
                  editor={editor}
                  onFocus={() => setActiveEditor(editor)}
                />
              </Box>

              <LoadingButton
                variant="contained"
                color="primary"
                onClick={handleSave}
                loading={loading}
              >
                Publicar noticia
              </LoadingButton>
            </Stack>
          </Box>
        </Container>

        {!isMobile && (
          <Box
            sx={{
              width: '25%',
              backgroundColor: 'white',
              borderLeft: '2px solid #ccc',
              padding: 2,
              height: '100%',
              mt: 5,
              minWidth: '150px',
              position: 'sticky',
              top: '5px',
              alignSelf: 'flex-start',
            }}
          >
            <Toolbar editor={activeEditor} />
          </Box>
        )}
      </Box>

      {isMobile && (
        <>
          <Fab
            color="primary"
            onClick={() => setDrawerOpen(true)}
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 1300,
              display: drawerOpen ? 'none' : '',
            }}
          >
            <KeyboardArrowUpIcon />
          </Fab>

          <Drawer
            anchor="bottom"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            PaperProps={{
              sx: {
                height: '40%',
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                p: 2,
              },
            }}
          >
            <Box display="flex" justifyContent="center">
              <IconButton onClick={() => setDrawerOpen(false)}>
                <KeyboardArrowDownIcon />
              </IconButton>
            </Box>
            <Toolbar editor={activeEditor} />
          </Drawer>
        </>
      )}
    </>
  );
};

export default UpdateNews;
