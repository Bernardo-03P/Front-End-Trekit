import React, { useState, useRef } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col, Image } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload } from 'react-bootstrap-icons';

const apiUrl = process.env.REACT_APP_API_URL;

const PaginaAdicionarTrilha = () => {
    const [formData, setFormData] = useState({
        nome: '',
        bairro: '',
        localizacao_maps: '',
        distancia_km: '',
        tempo_min: '',
        dificuldade: 'Fácil',
        sinalizacao: 'Sim',
        descricao: '',
        mapa_embed_url: ''
    });
    const [imagens, setImagens] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files).slice(0, 5);
            setImagens(filesArray);
            previews.forEach(url => URL.revokeObjectURL(url));
            const previewsArray = filesArray.map(file => URL.createObjectURL(file));
            setPreviews(previewsArray);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        const dataToSubmit = { ...formData };
        if (dataToSubmit.tempo_min === '') {
            dataToSubmit.tempo_min = null;
        }

        const data = new FormData();
        for (const key in dataToSubmit) {
            if (dataToSubmit[key] !== null && dataToSubmit[key] !== undefined) {
                data.append(key, dataToSubmit[key]);
            }
        }
        for (let i = 0; i < imagens.length; i++) {
            data.append('imagens', imagens[i]);
        }

        try {
            const token = localStorage.getItem('authToken');
            if (!token) { 
                setError("Sessão expirada. Por favor, faça login novamente."); 
                return; 
            }
            
            // ==============================================================================
            // CORREÇÃO: Usando a forma mais explícita e robusta de chamada do Axios
            //           para garantir o envio correto de FormData com headers.
            // ==============================================================================
            await axios({
                method: 'post',
                url: `${apiUrl}/api/trilhas`,
                data: data,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setSuccess('Trilha enviada para aprovação! Redirecionando...');
            setTimeout(() => navigate('/explorar'), 2000);

        } catch (err) {
            const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Erro ao adicionar a trilha.';
            setError(errorMessage);
            console.error(err);
        }
    };

    return (
        <Container className="py-5">
            <Link to="/explorar" className="btn btn-outline-secondary mb-4">
                <ArrowLeft /> Voltar
            </Link>
            <Row className="justify-content-center">
                <Col lg={10} xl={8}>
                    <Card className="p-4 shadow-sm">
                        <Card.Body>
                            <h2 className="text-center mb-4">Adicione uma Nova Trilha</h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && <Alert variant="success">{success}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Imagens da Trilha (até 5)</Form.Label>
                                    <div 
                                        className="border rounded p-5 text-center d-flex flex-column align-items-center justify-content-center"
                                        style={{cursor: 'pointer', backgroundColor: '#f8f9fa'}}
                                        onClick={() => fileInputRef.current.click()}
                                    >
                                        <Upload size={32} className="mb-2 text-muted" />
                                        <p className="m-0 text-muted">Clique ou arraste seus anexos para cá</p>
                                    </div>
                                    <Form.Control type="file" multiple accept="image/*" onChange={handleImageChange} ref={fileInputRef} hidden/>
                                </Form.Group>
                                {previews.length > 0 && (
                                    <Row className="mb-3">
                                        {previews.map((preview, index) => (
                                            <Col xs={4} md={3} lg={2} key={index} className="mb-2">
                                                <Image src={preview} thumbnail />
                                            </Col>
                                        ))}
                                    </Row>
                                )}
                                <Row>
                                    <Col md={6}><Form.Group className="mb-3"><Form.Control placeholder="Nome da Trilha" type="text" name="nome" value={formData.nome} onChange={handleChange} required /></Form.Group></Col>
                                    <Col md={6}><Form.Group className="mb-3"><Form.Control placeholder="Bairro" type="text" name="bairro" value={formData.bairro} onChange={handleChange} required /></Form.Group></Col>
                                </Row>
                                <Form.Group className="mb-3"><Form.Control type="text" placeholder="Localização (link geral do Google Maps)" name="localizacao_maps" value={formData.localizacao_maps} onChange={handleChange} /></Form.Group>
                                <Row>
                                    <Col><Form.Group className="mb-3"><Form.Control placeholder="Distância (km)" type="number" step="0.1" name="distancia_km" value={formData.distancia_km} onChange={handleChange} required /></Form.Group></Col>
                                    <Col><Form.Group className="mb-3"><Form.Control placeholder="Tempo (min)" type="number" name="tempo_min" value={formData.tempo_min} onChange={handleChange} /></Form.Group></Col>
                                </Row>
                                <Row>
                                    <Col><Form.Group className="mb-3"><Form.Select name="dificuldade" value={formData.dificuldade} onChange={handleChange}><option>Fácil</option><option>Moderado</option><option>Difícil</option><option>Muito Difícil</option></Form.Select></Form.Group></Col>
                                    <Col><Form.Group className="mb-3"><Form.Select name="sinalizacao" value={formData.sinalizacao} onChange={handleChange}><option>Sim</option><option>Não</option><option>Pouco</option><option>Muito</option></Form.Select></Form.Group></Col>
                                </Row>
                                <Form.Group className="mb-3"><Form.Control as="textarea" rows={5} placeholder="Descreva a trilha, pontos de interesse e dicas." name="descricao" value={formData.descricao} onChange={handleChange} /></Form.Group>
                                <Form.Group className="mb-3"><Form.Label>Código de Incorporação do Google Maps</Form.Label><Form.Control as="textarea" rows={4} placeholder='Vá ao Google Maps -> Compartilhar -> Incorporar um mapa -> Copie e cole o código HTML aqui.' name="mapa_embed_url" value={formData.mapa_embed_url} onChange={handleChange} /></Form.Group>
                                <div className="d-grid mt-3"><Button variant="primary" type="submit" size="lg">Publicar Trilha</Button></div>
                            </Form>
                        </Card.Body> 
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default PaginaAdicionarTrilha;