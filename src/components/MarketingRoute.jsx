import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MarketingRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (!user.marketing) return <Navigate to="/" replace />;

  return children;
};

export default MarketingRoute;