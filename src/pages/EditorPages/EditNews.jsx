import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  useTheme,
  useMediaQuery,
  Fab,
  Drawer,
  IconButton,
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
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Underline from '@tiptap/extension-underline';
import { useParams, useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const EditNews = () => {
  const { newsId } = useParams();
  const navigate = useNavigate();

  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeEditor, setActiveEditor] = useState(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: 'Editá el contenido de tu noticia...',
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
  });

  useEffect(() => {
    const fetchNews = async () => {
      const ref = doc(db, 'news', newsId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setMainImage(data.image || '');
        titleEditor?.commands.setContent(data.title || '');
        editor?.commands.setContent(data.content || '');
      } else {
        alert('Noticia no encontrada');
        navigate('/');
      }
    };

    if (editor && titleEditor) fetchNews();
  }, [editor, titleEditor, newsId, navigate]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setMainImage(file);
  };

  const handleUpdate = async () => {
    if (!titleEditor || !editor || !editor.getHTML()) {
      alert('Completá todos los campos.');
      return;
    }

    const title = titleEditor.getHTML().trim();
    if (!title) {
      alert('El título no puede estar vacío.');
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
      } else {
        image = mainImage;
      }

      await updateDoc(doc(db, 'news', newsId), {
        title: titleEditor.getHTML(),
        content: editor.getHTML(),
        image,
      });

      alert('Noticia actualizada');
      navigate('/editor/my-news');
    } catch (error) {
      console.error('Error al actualizar:', error);
      alert('Error al actualizar la noticia');
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
            backgroundColor: 'rgba(236, 252, 249, 0.7)',
            padding: 3,
            borderRadius: 2,
            marginLeft: isMobile ? 0 : '5rem',
            marginRight: isMobile ? 0 : '5rem',
            width: isMobile ? '100%' : '50%',
          }}
        >
          <Typography variant="h4" gutterBottom>
            Editar noticia
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
              <Box sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2, minHeight: 300 }}>
                <EditorContent editor={editor} onFocus={() => setActiveEditor(editor)} />
              </Box>
              <LoadingButton
                variant="contained"
                color="primary"
                onClick={handleUpdate}
                loading={loading}
              >
                Guardar cambios
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

export default EditNews;
