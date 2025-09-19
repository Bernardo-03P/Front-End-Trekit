import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Image, Card, Spinner, Alert, Button, Carousel } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';
import axios from 'axios';
import trailImagePlaceholder from '../assets/trailImage.png';
const apiUrl = process.env.REACT_APP_API_URL;
const PaginaAdminDetalhes = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trilha, setTrilha] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    useEffect(() => {
        const fetchTrilha = async () => {
            try {
                // A rota de detalhes da trilha já nos dá todas as infos que precisamos.
                const response = await axios.get(`${apiUrl}/api/trilhas/${id}`);
                setTrilha(response.data);
            } catch (err) {
                setError('Não foi possível carregar os detalhes da trilha.');
            } finally {
                setLoading(false);
            }
        };
        fetchTrilha();
    }, [id]);

    const handleAction = async (status) => {
        const actionText = status === 'aprovada' ? 'aprovar' : 'rejeitar';
        if (window.confirm(`Você tem certeza que deseja ${actionText} esta trilha?`)) {
            try {
                // Rota que já temos para atualizar o status
                await axios.patch(`${apiUrl}/api/admin/trilhas/${id}/status`, { status });
                navigate('/admin');
            } catch (err) {
                alert(`Erro ao ${actionText} a trilha.`);
            }
        }
    };

    if (loading) return <div className="text-center p-5"><Spinner /></div>;
    if (error) return <Alert variant="danger">{error}</Alert>;
    if (!trilha) return <Alert variant="warning">Trilha não encontrada.</Alert>;

    return (
        <Container className="py-5">
            <Link to="/admin" className="btn btn-outline-secondary mb-4"><ArrowLeft /> Voltar ao Painel</Link>
            <h1 className="mb-4">Painel de Administração - Detalhes da Trilha</h1>
            
            <Card className="shadow-sm">
                <Row className="g-0">
                    <Col md={5}>
                        <Carousel indicators={false}>
                            {trilha.imagens && trilha.imagens.length > 0 ? (
                                trilha.imagens.map(img => (
                                    <Carousel.Item key={img.id}>
                                        <Image src={`${apiUrl}/uploads/trilhas/${img.nome_arquivo}`} style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
                                    </Carousel.Item>
                                ))
                            ) : (
                                <Carousel.Item>
                                    <Image src={trailImagePlaceholder} style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
                                </Carousel.Item>
                            )}
                        </Carousel>
                    </Col>
                    <Col md={7}>
                        <Card.Body className="p-4 d-flex flex-column h-100">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <h3>{trilha.nome}, por {trilha.autor_nome}</h3>
                                </div>
                                <div className="d-flex gap-2">
                                    <Button variant="danger" onClick={() => handleAction('rejeitada')}>Cancelar</Button>
                                    <Button variant="success" onClick={() => handleAction('aprovada')}>Aprovar</Button>
                                </div>
                            </div>
                            <hr/>
                            <Row>
                                <Col sm={6}>
                                    <p><strong>Bairro:</strong> {trilha.bairro}</p>
                                    <p><strong>Sinalização:</strong> {trilha.sinalizacao}</p>
                                    <p><a href={trilha.localizacao_maps} target="_blank" rel="noopener noreferrer">Ver Link do Maps</a></p>
                                </Col>
                                <Col sm={6}>
                                    <p><strong>Distância:</strong> {trilha.distancia_km} km</p>
                                    <p><strong>Tempo:</strong> {trilha.tempo_min} min</p>
                                    <p><strong>Dificuldade:</strong> {trilha.dificuldade}</p>
                                </Col>
                            </Row>
                            <Card.Text className="mt-auto">{trilha.descricao}</Card.Text>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </Container>
    );
};

export default PaginaAdminDetalhes;