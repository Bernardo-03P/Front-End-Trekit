import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Image, Spinner, Alert } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';
import axios from 'axios';
import TrilhaCard from '../componentes/TrilhaCard';

import { ReactComponent as PapeleCanetaIcon } from '../assets/icons/PapeleCaneta.svg'; 
import { ReactComponent as SairIcon } from '../assets/icons/Sair.svg'; 
const apiUrl = process.env.REACT_APP_API_URL;
const PaginaPerfil = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [trilhas, setTrilhas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const loggedInUserString = localStorage.getItem('user');
    const loggedInUser = loggedInUserString ? JSON.parse(loggedInUserString) : null;
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            
            try {
                const [userResponse, trilhasResponse] = await Promise.all([
                axios.get(`${apiUrl}/api/users/${id}`, config),
                axios.get(`${apiUrl}/api/users/${id}/trilhas`, config)
            ]);
                setUser(userResponse.data);
                setTrilhas(trilhasResponse.data);
            } catch (err) {
                setError('Não foi possível carregar os dados do perfil.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleLikeChange = (trilhaId, newLikedState) => {
        setTrilhas(currentTrilhas => 
            currentTrilhas.map(trilha => 
                trilha.id === trilhaId 
                ? { ...trilha, is_liked_by_user: newLikedState } 
                : trilha
            )
        );
    };

    if (loading) return <div className="text-center p-5"><Spinner /></div>;
    if (error) return <Alert variant="danger">{error}</Alert>;
    if (!user) return <Alert variant="warning">Usuário não encontrado.</Alert>;
    
    const isOwnProfile = loggedInUser && loggedInUser.id === parseInt(id, 10);
    const cacheBuster = new Date().getTime();
    const avatarSrc = user.avatar_url ? `${apiUrl}/uploads/avatars/${user.avatar_url}?_=${cacheBuster}` : `https://i.pravatar.cc/150?u=${user?.id}`;


    return (
        <Container className="py-5">
            <Link to="/explorar" className="btn btn-outline-secondary mb-4"><ArrowLeft /> Voltar para Exploração</Link>
            
            <Row className="align-items-center mb-5">
                <Col xs="auto">
                    <Image src={avatarSrc} roundedCircle style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
                </Col>
                <Col>
                    <h1 className="fw-bold">{user.nome}</h1>
                    <p className="text-muted">@{user.username}</p>
                    <p>{user.bio || "Este usuário ainda não adicionou uma biografia."}</p>
           {isOwnProfile && (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '16px' }}>
        {/* Botão Editar Perfil */}
        <Link 
            to={`/editar-perfil/${user.id}`} 
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#34A853',
                color: 'white',
                padding: '10px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 500
            }}
        >
            <PapeleCanetaIcon style={{ width: '20px', height: '20px' }} />
            Editar Perfil
        </Link>

        {/* Botão Sair */}
        {/* ATENÇÃO: Altere o 'to' para sua rota de logout/sair */}
        <Link 
            to="/login" 
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#5f6368',
                textDecoration: 'none',
                fontWeight: 500
            }}
        >
            <SairIcon style={{ width: '20px', height: '20px' }} />
            Sair
        </Link>
    </div>
)}
                </Col>
                <Col md="auto" className="text-center">
                    <div className="fs-2 fw-bold">{trilhas.length}</div>
                    <div className="text-muted">TRILHAS CRIADAS</div>
                </Col>
            </Row>
            
            <div className="demonstracao_cards">
                <h2>Trilhas de {user.nome}</h2>
            </div>
            
            <div className="Container_CardsTrilhas">
                {trilhas.length > 0 ? (
                    trilhas.map(trilha => (
                        // Aqui está a mudança crucial: cada TrilhaCard está dentro de sua própria div com margem
                        // O grid agora é controlado apenas pelo CSS da classe pai.
                        <div key={trilha.id} style={{marginBottom: '1.5rem'}}>
                             <TrilhaCard trilha={trilha} onLikeChange={handleLikeChange} />
                        </div>
                    ))
                ) : (
                    <div className="alert-info" style={{padding: '2rem', textAlign: 'center', backgroundColor: '#eaf0eb', borderRadius: '1rem'}}>
                        Este usuário ainda não publicou nenhuma trilha.
                    </div>
                )}
            </div>
        </Container>
    );
};

export default PaginaPerfil;