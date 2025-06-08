// src/components/NewsCard.jsx
import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NewsCard = ({ id, title, image }) => {

    const navigate = useNavigate();
    
    const handleClick = () => {
      navigate(`/news/${id}`);
    };
 console.log(id);
  return (
    
    <Card
      onClick={handleClick}
      sx={{
        position: 'relative',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'transform 0.3s ease',
        cursor: 'pointer',
        marginTop: '2rem',
        '&:hover': {
          transform: 'scale(1.03)',
        },
        '&:hover .card-content': {
          background: 'rgba(0, 0, 0, 0.6)',
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={image}
        alt={title}
      />
      <CardContent
        className="card-content"
        sx={{
          position: 'absolute',
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          width: '98%',
          padding: '8px',
          transition: 'background 0.3s ease',
        }}
      >
<Typography
  variant="subtitle1"
  color="white"
  component="div"
  dangerouslySetInnerHTML={{ __html: title }}
sx={{
  fontSize: '0.9rem',
  '& *': {
    fontSize: 'inherit !important',
  },
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  textOverflow: 'ellipsis',
}}

/>

      </CardContent>
    </Card>
  );
};

export default NewsCard;
