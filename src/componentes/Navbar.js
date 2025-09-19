import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap'; // Manteremos para os botões Nav.Link
import { Navbar, Nav, Container, Button } from 'react-bootstrap';

import '../Navbar.css'; // Usaremos este CSS para o estilo
import logo from '../assets/icons/logo.svg'; // <-- IMPORTA O SEU LOGO
const apiUrl = process.env.REACT_APP_API_URL;
const AppNavbar = () => {
    const navigate = useNavigate();
    const authToken = localStorage.getItem('authToken');
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <Navbar expand="lg" className="navbar-custom py-3">
            <Container>
                <Link to="/explorar" state={{ reset: true }}>
                    <img src={logo} alt="Trekit Logo" style={{ height: '2.5rem' }} />
                </Link>
                
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        <LinkContainer to="/explorar" state={{ reset: true }}>
                            <Nav.Link className="mx-2">Explorar</Nav.Link>
                        </LinkContainer>
                        {authToken && (
                            <>
                                <LinkContainer to="/minhas-trilhas"><Nav.Link className="mx-2">Minhas Trilhas</Nav.Link></LinkContainer>
                                
                                {user?.role === 'admin' && (
                                    <LinkContainer to="/admin"><Nav.Link className="mx-2 fw-bold text-danger">Painel Admin</Nav.Link></LinkContainer>
                                )}

                                {user && (
                                    <LinkContainer to={`/perfil/${user.id}`}>
                                        {user.avatar_url ? (
                                            <Nav.Link as="img" src={user.avatar_url} className="navbar-avatar" />
                                        ) : (
                                            <Nav.Link className="mx-2">Meu Perfil</Nav.Link>
                                        )}
                                    </LinkContainer>
                                )}
                                <Button variant="outline-danger" onClick={handleLogout} className="mx-2">Sair</Button>
                            </>
                        )}
                        {!authToken && (
                            <>
                                <LinkContainer to="/cadastro"><Nav.Link className="mx-2">Cadastre-se</Nav.Link></LinkContainer>
                                <LinkContainer to="/login"><Nav.Link as={Button} className="btn-entre">Entrar</Nav.Link></LinkContainer>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;