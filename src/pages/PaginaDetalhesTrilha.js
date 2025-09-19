import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Image, Spinner, Alert, Form, Button, Carousel } from 'react-bootstrap';
import {
    GeoAlt, Heart, HeartFill, ConeStriped, Image as ImageIcon, Clock, DistributeHorizontal, Signpost, Funnel, HandThumbsUp, HandThumbsUpFill
} from 'react-bootstrap-icons';
import axios from 'axios';
import parse from 'html-react-parser';
import { jwtDecode } from 'jwt-decode';

import './PaginaDetalhesTrilha.css';
import trailImagePlaceholder from '../assets/trailImage.png';

const apiUrl = process.env.REACT_APP_API_URL;

const PaginaDetalhesTrilha = () => {
    // --- ESTADOS DA PÁGINA ---
    const { id } = useParams();
    const [trilha, setTrilha] = useState(null);
    const [comentarios, setComentarios] = useState([]);
    const [sugestoes, setSugestoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [novoComentario, setNovoComentario] = useState("");
    const [imagensSelecionadas, setImagensSelecionadas] = useState([]);

    // --- EFEITOS DE BUSCA DE DADOS ---
    useEffect(() => {
        if (!id) return;
        const fetchEssentialData = async () => {
            setLoading(true);
            setError('');
            const token = localStorage.getItem('authToken');
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            try {
                const [trilhaResponse, comentariosResponse] = await Promise.all([
                    axios.get(`${apiUrl}/api/trilhas/${id}`, config),
                    axios.get(`${apiUrl}/api/trilhas/${id}/comentarios`, config)
                ]);
                setTrilha(trilhaResponse.data);
                setComentarios(comentariosResponse.data);
            } catch (err) {
                console.error("Falha ao carregar dados essenciais:", err);
                setError('Não foi possível carregar os dados principais da trilha.');
            } finally {
                setLoading(false);
            }
        };
        fetchEssentialData();
    }, [id]);
    
    useEffect(() => {
        if (!id) return;
        const fetchSuggestions = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
                const response = await axios.get(`${apiUrl}/api/trilhas/sugestoes?excluir_id=${id}`, config);
                setSugestoes(response.data);
            } catch (err) {
                console.error("Falha ao carregar sugestões:", err);
            }
        };
        fetchSuggestions();
    }, [id]);

    // --- FUNÇÕES DE INTERAÇÃO (COM LÓGICA DE LIKE CORRIGIDA) ---
    const handleTrailLike = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) { alert("Você precisa estar logado para curtir."); return; }
        const originalTrailState = { ...trilha };
        const newLikedState = !trilha.is_liked_by_user;
        setTrilha(current => ({...current, is_liked_by_user: newLikedState}));
        try {
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            if (newLikedState) {
                await axios.post(`${apiUrl}/api/trilhas/${id}/like`, {}, config);
            } else {
                await axios.delete(`${apiUrl}/api/trilhas/${id}/like`, config);
            }
        } catch (err) {
            console.error("Erro ao curtir trilha:", err);
            setTrilha(originalTrailState);
        }
    };
    
    const handleCommentLike = async (commentId) => {
        const token = localStorage.getItem('authToken');
        if (!token) { alert("Você precisa estar logado para interagir."); return; }
        const originalComments = [...comentarios];
        const commentToUpdate = originalComments.find(c => c.id === commentId);
        if (!commentToUpdate) return;
        const isCurrentlyLiked = commentToUpdate.is_liked_by_user;
        setComentarios(currentComments => currentComments.map(c => 
            c.id === commentId 
                ? { ...c, is_liked_by_user: !isCurrentlyLiked, like_count: isCurrentlyLiked ? parseInt(c.like_count) - 1 : parseInt(c.like_count) + 1 } 
                : c
        ));
        try {
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            if (isCurrentlyLiked) {
                await axios.delete(`${apiUrl}/api/comentarios/${commentId}/like`, config);
            } else {
                await axios.post(`${apiUrl}/api/comentarios/${commentId}/like`, {}, config);
            }
        } catch (err) {
            console.error("Erro ao curtir comentário:", err);
            setComentarios(originalComments);
            alert("Não foi possível processar sua curtida.");
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files) setImagensSelecionadas(Array.from(e.target.files).slice(0, 3));
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!novoComentario.trim() && imagensSelecionadas.length === 0) return;
        try {
            const token = localStorage.getItem('authToken');
            if (!token) { alert("Sessão expirada. Faça login para comentar."); return; }
            const decodedToken = jwtDecode(token);
            const formData = new FormData();
            formData.append('conteudo', novoComentario);
            formData.append('autor_id', decodedToken.id);
            imagensSelecionadas.forEach(file => formData.append('imagens', file));
            const response = await axios.post(`${apiUrl}/api/trilhas/${id}/comentarios`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setComentarios([response.data, ...comentarios]);
            setNovoComentario("");
            setImagensSelecionadas([]);
            e.target.reset();
        } catch (err) {
            console.error("Erro ao postar comentário:", err);
            alert("Não foi possível postar o comentário.");
        }
    };

    // --- RENDERIZAÇÃO CONDICIONAL ---
    if (loading) return <div className="page-background d-flex justify-content-center align-items-center vh-100"><Spinner /></div>;
    if (error) return <div className="page-background"><Container className="py-5"><Alert variant="danger">{error}</Alert></Container></div>;
    if (!trilha) return <div className="page-background"><Container className="py-5"><Alert variant="warning">Trilha não encontrada.</Alert></Container></div>;

    const autorAvatarSrc = trilha.autor_avatar_url ? `${apiUrl}/uploads/avatars/${trilha.autor_avatar_url}` : `https://i.pravatar.cc/50?u=${trilha.autor_id}`;
        
    return (
        <div className="page-background">
            <div className="content-wrapper">
                {/* --- LINHA 1: CONTEÚDO E SIDEBAR --- */}
                <Row className="g-5">
                    <Col lg={7} className="trilha-main-content">
                        <div className="bloco-header"><h1 className='text-dark'>{trilha.nome}</h1><div className="estrelas-avaliacao text-success">★★★★★</div></div>
                        <div><Carousel className="trilha-carousel">{trilha.imagens && trilha.imagens.length > 0 ? trilha.imagens.map(img => (<Carousel.Item key={img.id}><Image src={`${apiUrl}/uploads/trilhas/${img.nome_arquivo}`} alt={`Imagem de ${trilha.nome}`} className="w-100" /></Carousel.Item>)) : <Carousel.Item><Image src={trailImagePlaceholder} alt="Placeholder" className="w-100" /></Carousel.Item>}</Carousel><div className="d-flex justify-content-between align-items-center mt-4 mb-5"><div className="d-flex align-items-center"><Image src={autorAvatarSrc} roundedCircle style={{ width: 50, height: 50, objectFit: 'cover' }} /><div className="ms-3"><p className="mb-0">feita por <strong>{trilha.autor_nome}</strong></p><small className="text-muted">postado em {new Date(trilha.created_at).toLocaleDateString()}</small></div></div><div onClick={handleTrailLike} style={{ cursor: 'pointer', transform: 'scale(1.5)' }}>{trilha.is_liked_by_user ? <HeartFill className="text-danger" /> : <Heart />}</div></div></div>
                        <div className="bloco-descricao"><p style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>{trilha.descricao || "Descrição indisponível."}</p></div>
                        <div className="bloco-mapa"><h3 className="fw-bold mb-3">Mapa</h3>{trilha.mapa_embed_url ? <div className="mapa-container">{parse(trilha.mapa_embed_url)}</div> : <div className="mapa-container d-flex align-items-center justify-content-center bg-light"><p className="text-muted">Mapa indisponível.</p></div>}<p className="text-muted mt-2"><GeoAlt /> {trilha.bairro}, {trilha.cidade}</p></div>
                    </Col>
                    <Col lg={5}>
                        <div className="sidebar-wrapper">
                            <div className="bloco-dados-trilha"><h4 className="fw-bold mb-3">Informações</h4><div className="detalhe-card"><GeoAlt size={20} /><div><small className="d-block">Localização</small><p className="mb-0 fw-bold">{trilha.bairro}</p></div></div><div className="detalhe-card"><ConeStriped size={20} /><div><small className="d-block">Dificuldade</small><p className="mb-0 fw-bold">{trilha.dificuldade}</p></div></div><div className="detalhe-card"><Signpost size={20} /><div><small className="d-block">Sinalização</small><p className="mb-0 fw-bold">{trilha.sinalizacao}</p></div></div><div className="detalhe-card-duplo mt-3"><div className="d-flex align-items-center gap-2"><Clock size={20} className="text-muted" /><div><small className="d-block">Tempo</small><p className="mb-0 fw-bold">{trilha.tempo_min || 0} min</p></div></div><div className="d-flex align-items-center gap-2"><DistributeHorizontal size={20} className="text-muted" /><div><small className="d-block">Distância</small><p className="mb-0 fw-bold">{trilha.distancia_km} km</p></div></div></div></div>
                            <div className="bloco-outras-trilhas">
                                <h5 className="fw-bold mb-3">Outras trilhas</h5>
                                <div className="outras-trilhas-lista">{sugestoes.length > 0 ? sugestoes.map(sugestao => (<Link to={`/trilhas/${sugestao.id}`} key={sugestao.id} className="sugestao-trilha"><Image src={sugestao.imagem_principal_url ? `${apiUrl}/uploads/trilhas/${sugestao.imagem_principal_url}` : trailImagePlaceholder} alt={`Imagem de ${sugestao.nome}`} /><div><h6 className="mb-0">{sugestao.nome}</h6><small className="text-muted">por {sugestao.autor_nome}</small></div></Link>)) : <p className="text-muted small">Nenhuma sugestão.</p>}</div>
                            </div>
                        </div>
                    </Col>
                </Row>
                {/* --- LINHA 2: SEÇÃO DE COMENTÁRIOS --- */}
                <Row>
                    <Col xs={12}>
                        <div className="bloco-comentarios-container">
                            <div className="d-flex justify-content-between align-items-center mb-4"><h3 className="fw-bold mb-0">{comentarios.length} comentários</h3><span className="text-muted" style={{cursor:'pointer'}}><Funnel className="me-1" /> Filtrar por</span></div>
                            <div className="bloco-form-comentario mb-5">
                                <Form onSubmit={handleCommentSubmit}><Form.Control as="textarea" rows={3} placeholder="Escreva algo..." value={novoComentario} onChange={(e) => setNovoComentario(e.target.value)} className="mb-3" />{imagensSelecionadas.length > 0 && (<div className="small text-muted mb-3">{imagensSelecionadas.length} arquivo(s) selecionado(s).</div>)}<div className="d-flex justify-content-between"><Form.Group><Form.Label htmlFor="anexar-imagem-comentario" className="btn btn-success m-0 px-4" style={{cursor:'pointer'}}><ImageIcon className="me-2" />Anexar</Form.Label><Form.Control type="file" id="anexar-imagem-comentario" multiple accept="image/*" onChange={handleImageChange} hidden /></Form.Group><div><Button variant="light" className="me-2 px-4" onClick={() => {setNovoComentario(""); setImagensSelecionadas([]);}}>Cancelar</Button><Button type="submit" style={{backgroundColor: '#00A97F', border: 'none'}} className="px-4">Enviar</Button></div></div></Form>
                            </div>
                            <div>
                                {comentarios.map(comment => 
                                    <div key={comment.id} className="py-4 border-bottom">
                                        <div className="d-flex gap-3">
                                            <Image src={comment.autor_avatar_url ? `${apiUrl}/uploads/avatars/${comment.autor_avatar_url}` : `https://i.pravatar.cc/50?u=${comment.autor_id}`} roundedCircle style={{ width: 50, height: 50, objectFit: 'cover' }} />
                                            <div className="flex-grow-1">
                                                <p className="mb-1"><strong>{comment.autor_nome}</strong> <span className="text-muted small">· {new Date(comment.created_at).toLocaleDateString()}</span></p>
                                                {comment.conteudo && <p>{comment.conteudo}</p>}
                                                {comment.imagens && comment.imagens.length > 0 && 
                                                    <Row xs={3} className="g-2 mt-2">
                                                        {comment.imagens.slice(0, 3).map((img, index) => 
                                                            <Col key={img.id}>
                                                                {index === 2 && comment.imagens.length > 3 ? 
                                                                    <div className="imagem-ver-tudo-container">
                                                                        <Image src={`${apiUrl}/uploads/comments/${img.nome_arquivo}`} className="imagem-comentario" />
                                                                        <div className="imagem-overlay">+{comment.imagens.length - 2}</div>
                                                                    </div> 
                                                                    : 
                                                                    <Image src={`${apiUrl}/uploads/comments/${img.nome_arquivo}`} className="img-fluid rounded" style={{ height: 120, objectFit: 'cover', width: '100%' }} />
                                                                }
                                                            </Col>
                                                        )}
                                                    </Row>
                                                }
                                                <div onClick={() => handleCommentLike(comment.id)} className={`mt-3 d-flex align-items-center gap-2 ${comment.is_liked_by_user ? 'text-primary' : 'text-muted'}`} style={{ cursor: 'pointer', width: 'fit-content' }}>
                                                    {comment.is_liked_by_user ? <HandThumbsUpFill /> : <HandThumbsUp />}
                                                    <span>{comment.like_count}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default PaginaDetalhesTrilha;