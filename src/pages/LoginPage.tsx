import { Flex, Spin, Typography } from 'antd';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { login } from '../requests/login';
import { useAuth } from '../hooks/useAuth';

const { Text } = Typography;

const LoginPage: React.FC = () => {
  const { login: setAuthTokens, isAuthorized } = useAuth();
  const { search } = useLocation();
  const navigate = useNavigate();

  const userId = search ? new URLSearchParams(search).get('userId') : null;

  useEffect(() => {
    // ✅ If already authorized — skip login
    if (isAuthorized) {
      navigate('/');
      return;
    }

    if (!userId) {
      navigate('/error', { state: { message: 'Missing user ID.' } });
      return;
    }

    const performLogin = async () => {
      try {
        const tokens = await login(Number(userId));
        setAuthTokens(tokens);
        navigate('/');
      } catch (error) {
        console.error('Login failed:', error);
        navigate('/error', {
          state: { message: 'Login failed. Please try again.' },
        });
      }
    };

    performLogin();
  }, [userId, isAuthorized, setAuthTokens, navigate]);

  return (
    <Flex
      align="center"
      justify="center"
      style={{ height: '100vh', flexDirection: 'column' }}
      gap="middle"
    >
      <Spin size="large" />
      <Text type="secondary">Signing you in, please wait...</Text>
    </Flex>
  );
};

export default LoginPage;