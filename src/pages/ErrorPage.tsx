import { Button, Flex, Result } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get message from navigation state, or fallback message
  const message =
    (location.state as { message?: string })?.message ||
    'Something went wrong. Please try again later.';

  return (
    <Flex
      align="center"
      justify="center"
      style={{ height: '100vh', flexDirection: 'column', padding: '1rem' }}
    >
      <Result
        status="error"
        title="Error"
        subTitle={message}
        extra={[
          <Button type="primary" key="home" onClick={() => navigate('/')}>
            Go Home
          </Button>,
        ]}
      />
    </Flex>
  );
};

export default ErrorPage;
