import React, { useState, useEffect } from 'react'; // <-- Adiciona useEffect
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom'; // <-- Adiciona useLocation
import { Person, Envelope, Eye } from 'react-bootstrap-icons';
// Importe seu logo (ajuste o caminho se necessário)
import logo from '../assets/icons/logo.svg'; 
// Importe o novo arquivo CSS
import '../PaginaAuth.css';
const apiUrl = process.env.REACT_APP_API_URL;
const PaginaCadastro = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation(); // <-- Hook para ler o estado da navegação

    // ----> INÍCIO DA MUDANÇA <----
    // Este useEffect roda sempre que a página carrega ou o "location.state" muda
    useEffect(() => {
        // Verifica se recebemos o "pacote de dados" da página de termos
        if (location.state?.termsAccepted === true) {
            setAgreeTerms(true); // Marca o checkbox automaticamente
        }
    }, [location.state]); // O hook reage a mudanças no estado da navegação
    // ----> FIM DA MUDANÇA <----

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!agreeTerms) {
            setError('Você precisa concordar com os Termos e Condições de Uso para se cadastrar.');
            return;
        }
        try {
             await axios.post(`${apiUrl}/api/auth/register`, { nome, email, username, senha });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao cadastrar. Tente novamente.');
        }
    };

     return (
        <div className="auth-page-background">
            <div className="auth-form-container">
                <div className="auth-header">
                    <img src={logo} alt="Logo Trekit" style={{ height: '2.5rem' }}/>
                    <h2>Bem-vindo(a) ao Trekit</h2>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit} className="text-start">
                    
                    <Form.Group className="form-group-container">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control type="text" className="auth-input" value={nome} onChange={(e) => setNome(e.target.value)} required />
                    </Form.Group>
                    
                    <Form.Group className="form-group-container">
                        <Form.Label>Nome de usuário</Form.Label>
                        <div className="form-input-wrapper">
                            <Form.Control type="text" className="auth-input" value={username} onChange={(e) => setUsername(e.target.value)} required />
                            <Person className="form-input-icon"/>
                        </div>
                    </Form.Group>
                    
                    <Form.Group className="form-group-container">
                        <Form.Label>E-mail</Form.Label>
                        <div className="form-input-wrapper">
                             <Form.Control type="email" className="auth-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
                             <Envelope className="form-input-icon"/>
                        </div>
                    </Form.Group>
                   
                    <Form.Group className="form-group-container">
                        <Form.Label>Senha</Form.Label>
                        <div className="form-input-wrapper">
                             <Form.Control type="password" className="auth-input" value={senha} onChange={(e) => setSenha(e.target.value)} required />
                             <Eye className="form-input-icon"/>
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Check 
                            type="checkbox"
                            id="agree-terms-checkbox"
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                            label={
                                <span>
                                    Eu li e concordo com os{' '}
                                    <Link to="/termos" className="terms-link">
                                        Termos e Condições de uso
                                    </Link>
                                </span>
                            }
                        />
                    </Form.Group>
                    
                    <Button type="submit" className="w-100 auth-submit-btn">
                        Cadastrar
                    </Button>
                </Form>

                <p className="mt-4 text-center">
                    Já tem uma conta? <Link to="/login" className="secondary-link">Entre</Link>
                </p>
            </div>
        </div>
    );
};

export default PaginaCadastro;