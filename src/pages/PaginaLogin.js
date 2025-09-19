import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, Link} from 'react-router-dom';
import { Envelope, Eye } from 'react-bootstrap-icons';
import logo from '../assets/icons/logo.svg'; 
import '../PaginaAuth.css'; 
const apiUrl = process.env.REACT_APP_API_URL;
const PaginaLogin = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
           const response = await axios.post(`${apiUrl}/api/auth/login`, { email, senha });
            // Armazena o token
            localStorage.setItem('authToken', response.data.token);
            // CORREÇÃO: Salva o objeto de usuário inteiro como string JSON
            localStorage.setItem('user', JSON.stringify(response.data.user));
            // Redireciona para a página principal
            navigate('/explorar');
        } catch (err) {
            setError(err.response?.data?.message || 'Erro no login. Verifique suas credenciais.');
        }
    };

    return (
        <div className="auth-page-background">
            <div className="auth-form-container">
                <div className="auth-header">
                    <img src={logo} alt="Logo Trekit" style={{ height: '2.5rem' }}/>
                    <h2>Bem-vindo(a) de volta</h2>
                </div>

                {error && <Alert variant="danger" className="text-center">{error}</Alert>}

                <Form onSubmit={handleSubmit} className="text-start">
                    
                    <Form.Group className="form-group-container">
                        <Form.Label>E-mail</Form.Label>
                        <div className="form-input-wrapper">
                            <Form.Control 
                                type="email" 
                                className="auth-input" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                            <Envelope className="form-input-icon"/>
                        </div>
                    </Form.Group>
                   
                    <Form.Group className="form-group-container">
                        <Form.Label>Senha</Form.Label>
                        <div className="form-input-wrapper">
                            <Form.Control 
                                type="password" 
                                className="auth-input" 
                                value={senha} 
                                onChange={(e) => setSenha(e.target.value)} 
                                required 
                            />
                            <Eye className="form-input-icon"/>
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Check 
                            type="checkbox"
                            id="remember-me-checkbox"
                            label="Manter-me conectado"
                        />
                    </Form.Group>
                    
                    <Button type="submit" className="w-100 auth-submit-btn">
                        Entrar
                    </Button>
                </Form>

                <p className="mt-4 text-center">
                    Não tem uma conta? <Link to="/cadastro" className="secondary-link">Cadastre-se</Link>
                </p>
            </div>
        </div>
    );
};

export default PaginaLogin;