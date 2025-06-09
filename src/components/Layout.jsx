import { Box } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';
import SideAds from './SideAds';

const Layout = ({ children }) => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Navbar />
      <Box component="main" flexGrow={1}>
        {children}
      </Box>
      <SideAds />
      <Footer />
    </Box>
  );
};

export default Layout;
