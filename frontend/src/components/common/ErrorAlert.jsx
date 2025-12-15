import { Alert } from 'react-bootstrap';
import { CloseCircleOutlined } from '@ant-design/icons';

const ErrorAlert = ({ error, onClose }) => {
  if (!error) return null;

  const errorMessage = typeof error === 'string' ? error : error.message || 'An error occurred';

  return (
    <Alert variant="danger" dismissible onClose={onClose} className="mb-4">
      <div className="d-flex align-items-start">
        <CloseCircleOutlined style={{ fontSize: '24px', marginRight: '12px', marginTop: '2px' }} />
        <div className="flex-grow-1">
          <Alert.Heading className="h6 mb-1">Error</Alert.Heading>
          <p className="mb-0">{errorMessage}</p>
        </div>
      </div>
    </Alert>
  );
};

export default ErrorAlert;
