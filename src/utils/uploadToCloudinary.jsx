export const uploadToCloudinary = async (file) => {
  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', 'sabelo_upload');
  data.append('folder', 'ads'); 

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/dmhzoafnw/image/upload`, {
      method: 'POST',
      body: data,
    });

    const json = await res.json();

    if (!res.ok) throw new Error(json.error?.message || 'Error al subir imagen');

    return json.secure_url;
  } catch (err) {
    console.error('Error al subir imagen a Cloudinary:', err);
    throw err;
  }
};
