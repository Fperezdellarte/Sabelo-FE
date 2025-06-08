// ProtectedEditorRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EditorRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (!user.editor) return <Navigate to="/" replace />;

  return children;
};

export default EditorRoute;
