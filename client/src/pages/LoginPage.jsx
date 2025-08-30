import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to profile if already logged in
    if (user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  return <LoginForm />;
};

export default LoginPage;