import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Badge, Dropdown } from 'react-bootstrap';
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import SearchBar from '../search/SearchBar';

const Header = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      className="shadow-sm"
      style={{ marginBottom: 0 }}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4">
          Shopizer
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="px-3">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/products" className="px-3">
              Products
            </Nav.Link>
            {isAuthenticated && !isAdmin && (
              <Nav.Link as={Link} to="/orders" className="px-3">
                My Orders
              </Nav.Link>
            )}
            {isAdmin && (
              <Nav.Link as={Link} to="/admin" className="px-3">
                Admin Dashboard
              </Nav.Link>
            )}
          </Nav>

          {!isAdmin && <SearchBar />}

          <Nav className="align-items-center margin ">
            {!isAdmin && (
              <Nav.Link
                as={Link}
                to="/cart"
                className="position-relative px-3 "
              >
                <ShoppingCartOutlined style={{ fontSize: "22px" }} />
                {itemCount > 0 && (
                  <Badge
                    bg="danger"
                    pill
                    className="position-absolute top-0 start-100 translate-middle"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Nav.Link>
            )}

            {isAuthenticated ? (
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="dark"
                  id="dropdown-user"
                  className="border-0 m-3"
                >
                  <UserOutlined
                    style={{ fontSize: "20px", marginRight: "8px" }}
                  />
                  <span>{user?.username}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {!isAdmin && (
                    <>
                      <Dropdown.Item as={Link} to="/profile">
                        Profile
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/orders">
                        My Orders
                      </Dropdown.Item>
                      <Dropdown.Divider />
                    </>
                  )}
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="px-3">
                  Customer Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="px-3">
                  Register
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/login" className="px-3">
                  Admin
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
