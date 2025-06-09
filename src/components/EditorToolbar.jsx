import React, { useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import ImageIcon from '@mui/icons-material/Image';  
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ImageSizeDropdown from './ImageSizeDropdown'; 


const FONT_LIST = [
  'Arial', 'Verdana', 'Helvetica', 'Times New Roman', 'Georgia', 'Courier New', 'Lucida Console',
  'Trebuchet MS', 'Impact', 'Comic Sans MS', 'Palatino', 'Garamond', 'Bookman', 'Candara',
  'Segoe UI', 'Tahoma', 'Geneva', 'Optima', 'Calibri', 'Cambria', 'Franklin Gothic Medium',
  'Futura', 'Gill Sans', 'Rockwell', 'Baskerville', 'Century Gothic', 'Didot', 'Consolas',
  'Avenir', 'Monaco', 'Brush Script MT', 'Copperplate', 'Papyrus', 'Tahoma', 'Sans-serif',
  'Roboto', 'Open Sans', 'Lato', 'Poppins', 'Raleway', 'Merriweather', 'Ubuntu', 'Work Sans',
  'Quicksand', 'Nunito', 'Zilla Slab', 'Karla', 'Inconsolata', 'Rubik', 'Manrope'
];

const EditorToolbar = ({ editor }) => {
  const [anchorFont, setAnchorFont] = useState(null);
  const [anchorSize, setAnchorSize] = useState(null);
  const [fontSizeInput, setFontSizeInput] = useState('');

  if (!editor) return null;

  const applyFont = (font) => {
    editor.chain().focus().setFontFamily(font).run();
    setAnchorFont(null);
  };

  const applySize = (size) => {
    editor.chain().focus().setFontSize(size).run();
    setFontSizeInput('');
    setAnchorSize(null);
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        editor.chain().focus().setImage({ src: base64 }).run();
        setTimeout(() => {
          editor.commands.selectParentNode();
        }, 100);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1,}}>
      <Typography variant="subtitle1" fontWeight="bold">Herramientas</Typography>

      <ButtonGroup variant="outlined">
        <Button onClick={() => editor.chain().focus().toggleBold().run()}><FormatBoldIcon /></Button>
        <Button onClick={() => editor.chain().focus().toggleItalic().run()}><FormatItalicIcon /></Button>
        <Button onClick={() => editor.chain().focus().toggleUnderline().run()}><FormatUnderlinedIcon /></Button>
      </ButtonGroup>

      <ButtonGroup variant="outlined">
        <Button onClick={() => editor.chain().focus().toggleBulletList().run()}><FormatListBulletedIcon /></Button>
        <Button onClick={() => editor.chain().focus().toggleOrderedList().run()}><FormatListNumberedIcon /></Button>
      </ButtonGroup>

      <Button variant="outlined" onClick={handleImageUpload} startIcon={<ImageIcon />}>
        Insertar imagen
      </Button>
      {editor && <ImageSizeDropdown editor={editor} />}

      <Button
        variant="outlined"
        endIcon={<ArrowDropDownIcon />}
        onClick={(e) => setAnchorFont(e.currentTarget)}
      >
        Fuente
      </Button>
      <Menu
        anchorEl={anchorFont}
        open={Boolean(anchorFont)}
        onClose={() => setAnchorFont(null)}
        PaperProps={{ style: { maxHeight: 300 } }}
      >
        {FONT_LIST.map((font) => (
          <MenuItem
            key={font}
            onClick={() => applyFont(font)}
            style={{ fontFamily: font }}
          >
            {font}
          </MenuItem>
        ))}
      </Menu>

      <Button
        variant="outlined"
        endIcon={<ArrowDropDownIcon />}
        onClick={(e) => setAnchorSize(e.currentTarget)}
      >
        Tamaño
      </Button>
      <Menu
        anchorEl={anchorSize}
        open={Boolean(anchorSize)}
        onClose={() => setAnchorSize(null)}
      >
        {[10, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72].map(size => (
          <MenuItem key={size} onClick={() => applySize(size)}>{size}px</MenuItem>
        ))}
        <Box sx={{ px: 2, py: 1 }}>
          <TextField
            label="Personalizado"
            size="small"
            type="number"
            value={fontSizeInput}
            onChange={(e) => setFontSizeInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') applySize(fontSizeInput);
            }}
          />
        </Box>
      </Menu>
    </Box>
  );
};

export default EditorToolbar;
