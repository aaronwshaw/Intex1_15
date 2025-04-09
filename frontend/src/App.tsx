import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import PrivacyPolicy from './pages/PrivacyTest';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LandingPage from './pages/LandingPage';
import AdminPage from './pages/AdminPage';
import MovieInfo from './pages/MovieInfo';
import SearchPage from './pages/SearchPage';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/movieinfo/:show_id" element={<MovieInfo />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </>
  );
}

export default App;
