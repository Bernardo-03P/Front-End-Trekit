import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Alert, Spinner, InputGroup, Form, Button, Carousel } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import TrilhaCard from '../componentes/TrilhaCard';
import FiltrosLateral from '../componentes/FiltrosLateral';

// Importa suas imagens de banner da pasta /src/assets
import banner1 from '../assets/banner1.jpg';
import banner2 from '../assets/banner2.jpg';
import banner3 from '../assets/banner3.jpg';

const filtrosIniciais = {
    busca: '',
    dificuldade: '',
    bairro: '',
    distanciaMin: '',
    distanciaMax: '',
    sinalizacao: ''
};
const apiUrl = process.env.REACT_APP_API_URL;
const PaginaExplorar = () => {
    const [trilhas, setTrilhas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filtros, setFiltros] = useState(filtrosIniciais);
    const [modoBusca, setModoBusca] = useState(false);
    const [termoBuscado, setTermoBuscado] = useState('');
    const location = useLocation(); // Hook para ler dados de navegação

    const fetchTrilhas = useCallback(async (filtrosAtuais) => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('authToken');
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            
            const params = new URLSearchParams();
            for (const key in filtrosAtuais) {
                if (filtrosAtuais[key]) params.append(key, filtrosAtuais[key]);
            }
            const response = await axios.get(`${apiUrl}/api/trilhas?${params.toString()}`, config);
            setTrilhas(response.data);
            
        } catch (err) {
            setError('Não foi possível carregar as trilhas.');
        } finally {
            setLoading(false);
        }
    }, []);
    
    // Efeito para resetar a página ao navegar pela navbar
    useEffect(() => {
        if (location.state?.reset === true) {
            setModoBusca(false);
            setFiltros(filtrosIniciais);
        }
    }, [location.state]);

    useEffect(() => {
        fetchTrilhas(filtros);
    }, [fetchTrilhas, filtros]);

    const handleLikeChange = (trilhaId, newLikedState) => {
        setTrilhas(current => current.map(t => t.id === trilhaId ? { ...t, is_liked_by_user: newLikedState } : t));
    };

    const handleFiltroChange = (e) => {
        setFiltros(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setModoBusca(true);
        setTermoBuscado(filtros.busca);
        fetchTrilhas(filtros);
    };

    const handleClearFilters = () => {
        setFiltros(filtrosIniciais);
        // Não muda mais o modoBusca para false, deixa o usuário no modo de busca com filtros limpos
    };

    const renderResults = () => {
        if (loading) return <div className="text-center w-100"><Spinner /></div>;
        if (error) return <Col xs={12}><Alert variant="danger">{error}</Alert></Col>;
        if (trilhas.length === 0) return <Col xs={12}><Alert variant="info">Nenhuma trilha encontrada.</Alert></Col>;
        
        return (modoBusca ? trilhas : trilhas.slice(0, 6)).map(trilha => (
            <Col key={trilha.id} xs={12} className="mb-3">
                <TrilhaCard trilha={trilha} onLikeChange={handleLikeChange} />
            </Col>
        ));
    };

    return (
        <Container className="py-5">
            {!modoBusca && (
                <Carousel fade controls={false} indicators={false} interval={4000}>
                    <Carousel.Item><img className="d-block w-100 banner-img" src={banner1} alt="Banner 1" /></Carousel.Item>
                    <Carousel.Item><img className="d-block w-100 banner-img" src={banner2} alt="Banner 2" /></Carousel.Item>
                    <Carousel.Item><img className="d-block w-100 banner-img" src={banner3} alt="Banner 3" /></Carousel.Item>
                </Carousel>
            )}

           <div className="d-flex align-items-center gap-3 "  style={{ marginTop: '3rem', maxWidth: '1000px', marginBottom: '3rem', marginLeft: '6rem' }}>

    <InputGroup 
        onFocus={() => setModoBusca(true)}
        style={{
            borderRadius: '12px',
            border: '1px solid #b3b0b0ff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            backgroundColor: 'white',
            padding: '0,5rem'
        }}
    >
        <Form.Control 
            name="busca" 
            placeholder="Pesquise por trilhas, bairros..." 
            value={filtros.busca} 
            onChange={handleFiltroChange}
            style={{ 
                border: 'none', 
                boxShadow: 'none', 
                backgroundColor: 'transparent',
                height: '3rem',
                fontSize: '1rem'
            }}
        />
        <Button 
            type="submit" 
            style={{
                border: 'none',
                borderRadius: '8px',
                fontWeight: 500,
                color: 'white',
                padding: '0 2rem',
                background: 'linear-gradient(90deg, #53D7F3 0%, #30A665 100%)',
            }}
        >
            Buscar
        </Button>
    </InputGroup>
    
    <Link 
        to="/adicionar-trilha"
        style={{
            backgroundColor: '#1aac4bff',
            color: 'white',
            fontWeight: 500,
            border: 'none',
            borderRadius: '8px',
            padding: '0.8rem 1.5rem',
            whiteSpace: 'nowrap',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            height: '3.5rem' // Garante a mesma altura
        }}
    >
        + Adicionar Trilha
    </Link>
    
</div>

            {modoBusca ? (
                <Row>
                    <Col md={4} lg={3} className="filtros-coluna">
                        <FiltrosLateral filtros={filtros} handleFiltroChange={handleFiltroChange} applyFilters={handleSearchSubmit} onClearFilters={handleClearFilters}/>
                    </Col>
                    <Col md={8} lg={9}>
                        <div className="mb-4">
                            <h2 className="mb-1 fw-bold">Resultados para "{termoBuscado || '...'}"</h2>
                            <p className="text-muted">Exibindo {trilhas.length} resultados</p>
                        </div>
                        <Row>{renderResults()}</Row>
                    </Col>
                </Row>
            ) : (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 className="fw-bold">Explorar Trilhas</h2>
                        <Button variant="link" className="text-muted" onClick={() => setModoBusca(true)}>Veja mais</Button>
                    </div>
                    <Row>{renderResults()}</Row>
                </>
            )}
        </Container>
    );
};

export default PaginaExplorar;