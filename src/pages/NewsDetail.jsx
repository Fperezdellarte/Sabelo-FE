import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Container,
  Button,
  Divider,
  Avatar,
  CircularProgress,
} from '@mui/material';
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [author, setAuthor] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    axios
      .get(`https://sabelo-be.onrender.com/api/news/${id}`)
      .then((res) => setNews(res.data))
      .catch(() => setNews(null));
  }, [id]);

  useEffect(() => {
    const fetchAuthor = async () => {
      if (!news?.userId) return;
      try {
        const authorRef = doc(db, 'users', news.userId);
        const authorSnap = await getDoc(authorRef);
        if (authorSnap.exists()) {
          setAuthor(authorSnap.data());
        }
      } catch (error) {
        console.error('Error al obtener autor:', error);
      }
    };
    fetchAuthor();
  }, [news]);

  useEffect(() => {
    const q = query(collection(db, 'comments'), where('newsId', '==', id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(groupComments(data));
    });
    return () => unsubscribe();
  }, [id]);

  const handleSubmit = async (parentId = null) => {
    if (!comment.trim()) return;

    try {
      await addDoc(collection(db, 'comments'), {
        newsId: id,
        text: comment,
        user: user.name || 'Anónimo',
        userId: user.uid,
        createdAt: serverTimestamp(),
        parentId: parentId || null,
        likes: [],
      });
      setComment('');
    } catch (error) {
      console.error('Error al enviar comentario:', error);
    }
  };

  const handleLike = async (commentId, likedByUser) => {
    const commentRef = doc(db, 'comments', commentId);
    try {
      await updateDoc(commentRef, {
        likes: likedByUser ? arrayRemove(user.uid) : arrayUnion(user.uid),
      });
    } catch (error) {
      console.error('Error al dar like:', error);
    }
  };

  const groupComments = (commentsArray) => {
    const commentMap = {};
    const result = [];

    commentsArray.forEach((c) => {
      commentMap[c.id] = { ...c, replies: [] };
    });

    commentsArray.forEach((c) => {
      if (c.parentId && commentMap[c.parentId]) {
        commentMap[c.parentId].replies.push(commentMap[c.id]);
      } else {
        result.push(commentMap[c.id]);
      }
    });

    return result;
  };

  const Comment = ({ comment, isRoot = false }) => {
    const [showReplies, setShowReplies] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');
    const replyBoxRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (replyBoxRef.current && !replyBoxRef.current.contains(event.target)) {
          setIsReplying(false);
        }
      };
      if (isReplying) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isReplying]);

    const handleReply = async () => {
      if (!replyText.trim()) return;
      try {
        await addDoc(collection(db, 'comments'), {
          newsId: comment.newsId,
          text: replyText,
          user: user.name || 'Anónimo',
          userId: user.uid,
          createdAt: serverTimestamp(),
          parentId: comment.id,
          likes: [],
        });
        setReplyText('');
        setIsReplying(false);
      } catch (error) {
        console.error('Error al responder comentario:', error);
      }
    };

    return (
      <Box
        key={comment.id}
        p={isRoot ? 2 : 0}
        m={2}
        pl={2}
        border={isRoot ? '1px solid rgba(128, 128, 128, 0.1)' : 0}
        borderRadius="20px"
      >
        <Typography variant="subtitle2" fontWeight="bold">
          {comment.user}
        </Typography>
        <Typography mb={1} pl={1}>
          {comment.text}
        </Typography>

        <Button
          size="small"
          onClick={() => handleLike(comment.id, comment.likes?.includes(user?.uid))}
          style={{ textTransform: 'none', paddingLeft: 0 }}
        >
          {comment.likes?.includes(user?.uid) ? (
            <ThumbUpAltIcon sx={{ color: 'black' }} />
          ) : (
            <ThumbUpOffAltIcon sx={{ color: 'rgba(1, 1, 1, 0.36)' }} />
          )}
          <Typography variant="body2" color="text.secondary" ml={1}>
            {comment.likes?.length || 0}
          </Typography>
        </Button>

        <Button
          style={{ color: 'rgb(78, 78, 78)', textTransform: 'lowercase' }}
          size="small"
          onClick={() => setIsReplying(true)}
        >
          Responder
        </Button>

        {comment.replies?.length > 0 && (
          <Button
            size="small"
            style={{ color: 'rgb(78, 78, 78)', textTransform: 'lowercase' }}
            onClick={() => setShowReplies(!showReplies)}
          >
            {showReplies ? 'Ocultar respuestas' : `Ver ${comment.replies.length} respuesta(s)`}
          </Button>
        )}

        <Typography variant="caption" color="text.secondary">
          {comment.createdAt?.toDate
            ? `Hace ${formatDistanceToNow(comment.createdAt.toDate(), { locale: es })}`
            : 'Hace un momento'}
        </Typography>

        {isReplying && (
          <Box mt={1} ref={replyBoxRef}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                padding: '12px 16px',
                borderBottom: '2px solid rgba(0, 0, 0, 0.3)',
                ':focus-within': {
                  borderColor: '#1976d2',
                  boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '16px',
                },
              }}
            >
              <textarea
                placeholder="Escribe tu respuesta..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  fontSize: '16px',
                  backgroundColor: 'transparent',
                  fontFamily: 'inherit',
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Button onClick={handleReply}>Enviar</Button>
            </Box>
          </Box>
        )}

        {showReplies &&
          comment.replies?.map((reply) => (
            <Box key={reply.id} ml={4}>
              <Comment comment={reply} isRoot={false} />
            </Box>
          ))}
      </Box>
    );
  };

  if (!news) {
    return <Typography variant="h5" textAlign="center">News not found</Typography>;
  }

  return (
    <Container
      sx={{
        pt: 3,
        px: { xs: 2, sm: 4, md: 6, lg: 12 },
        pb: 6,
        backgroundColor: 'rgba(236, 252, 249, 1)',
        borderRadius: '20px',
        mt: 6,
        maxWidth: 'md',
        width: { lg: '80%', xs: '90%' },
      }}
    >
      <Box dangerouslySetInnerHTML={{ __html: news.title }} />

      <Box
        component="img"
        src={news.image}
        alt={news.title}
        sx={{
          width: '100%',
          objectFit: 'cover',
          borderRadius: 2,
          mb: 3,
        }}
      />

      <Box sx={{ typography: 'body1' }} dangerouslySetInnerHTML={{ __html: news.content }} />

      <Divider sx={{ my: 4 }} />
      {author ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            mb: 3,
            color: 'grey',
          
          }}
        >
          <Avatar
            src={author.photoURL || ''}
            alt={author.name}
            sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}
          >
            {!author.photoURL && author.name?.charAt(0)}
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: '500' }}>
            Publicado por {author.name || 'Autor desconocido'}
          </Typography>
        </Box>
      ) : (
        <CircularProgress size={24} sx={{ display: 'block', mx: 'auto', my: 2 }} />
      )}

      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" gutterBottom>
        Comentarios:
      </Typography>

      {user ? (
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              p: 2,
              borderBottom: '2px solid rgba(0, 0, 0, 0.3)',
              ':focus-within': {
                borderColor: '#1976d2',
                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)',
                backgroundColor: 'white',
                borderRadius: '16px',
              },
            }}
          >
            <textarea
              placeholder="Dejar un comentario..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                resize: 'none',
                fontSize: '16px',
                backgroundColor: 'transparent',
                fontFamily: 'inherit',
              }}
            />
            {comment.trim() && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button variant="contained" size="small" onClick={() => handleSubmit(null)}>
                  Comentar
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      ) : (
        <Typography variant="body1" color="text.secondary">
          Inicia sesión para dejar un comentario.
        </Typography>
      )}

      <Box
        mt={4}
        sx={{
          borderRadius: '20px',
          backgroundColor: 'rgb(255, 255, 255)',
          p: 2,
        }}
      >
        {comments.length === 0 ? (
          <Typography>No hay comentarios aún.</Typography>
        ) : (
          comments.map((comment) => <Comment key={comment.id} comment={comment} isRoot={true} />)
        )}
      </Box>
    </Container>
  );
};

export default NewsDetail;
