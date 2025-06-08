import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NewsDetail from './pages/NewsDetail';
import Layout from './components/Layout';
import About from './pages/About';
import Register from './pages/Register';
import Login from './pages/Login';
import AdminPage from './pages/AdminPages/AdminPage';
import AdminRoute from './components/AdminRoute';
import EditorRoute from './components/EditorRoute';
import EditorPage from './pages/EditorPages/EditorPage';
import UpdateNews from './pages/EditorPages/UpdateNews';
import MyComments from './pages/EditorPages/MyComments';
import MyNews from './pages/EditorPages/MyNews';
import EditNews from './pages/EditorPages/EditNews';
import AllNews from './pages/AdminPages/AllNews';
import AdsManager from './pages/AdminPages/AdsManager';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
          <Route path="/admin/news" element={<AdminRoute><AllNews /></AdminRoute>} />
          <Route path="/admin/ads" element={<AdminRoute><AdsManager /></AdminRoute>} />
          <Route path="/editor"element={<EditorRoute><EditorPage /></EditorRoute>}/>
          <Route path="/editor/update-news"element={<EditorRoute><UpdateNews /></EditorRoute>}/>
          <Route path="/editor/my-comments"element={<EditorRoute><MyComments /></EditorRoute>}/>
          <Route path="/editor/my-news"element={<EditorRoute><MyNews /></EditorRoute>}/>
          <Route path="/editor/edit-news/:newsId"element={<EditorRoute><EditNews /></EditorRoute>}/>
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
