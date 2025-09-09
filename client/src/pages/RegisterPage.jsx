import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RegisterForm from '../components/RegisterForm';

const RegisterPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to profile if already logged in
    if (user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  return <RegisterForm />;
};

export default RegisterPage;