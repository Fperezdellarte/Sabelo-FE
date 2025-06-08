import React, { useState } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const ImageSizeDropdown = ({ editor }) => {
  const [selectedSize, setSelectedSize] = useState('100%');

  const handleChange = (event) => {
    const newSize = event.target.value;
    if (!editor.isActive('image')) {
      editor.commands.selectParentNode();
    }

    editor
      .chain()
      .focus()
      .updateAttributes('image', { width: newSize })
      .run();

    setSelectedSize(newSize);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="image-size-label">Tamaño</InputLabel>
        <Select
          labelId="image-size-label"
          id="image-size-select"
          value={selectedSize}
          label="Tamaño"
          onChange={handleChange}
        >
          <MenuItem value="25%">25%</MenuItem>
          <MenuItem value="50%">50%</MenuItem>
          <MenuItem value="75%">75%</MenuItem>
          <MenuItem value="100%">100%</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default ImageSizeDropdown;
