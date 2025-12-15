import { Spinner } from 'react-bootstrap';

const Loader = ({ size = 'md', text = 'Loading...' }) => {
  const spinnerSize = size === 'sm' ? 'sm' : undefined;

  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-4">
      <Spinner animation="border" role="status" size={spinnerSize}>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      {text && <p className="mt-3 text-muted">{text}</p>}
    </div>
  );
};

export default Loader;
