import React, { useState, useEffect } from 'react';
import { Container, Alert, Spinner, Table, Button, Image, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import trailImagePlaceholder from '../assets/trailImage.png';
const apiUrl = process.env.REACT_APP_API_URL;
const PaginaAdmin = () => {
    const [trilhas, setTrilhas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchTrilhas = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${apiUrl}/api/admin/todas-as-trilhas`);
            setTrilhas(response.data.sort((a, b) => a.status.localeCompare(b.status)));
        } catch (err) {
            setError('Não foi possível carregar as trilhas.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrilhas();
    }, []);

    const handleDelete = async (trilhaId, trilhaNome) => {
        if (window.confirm(`Você tem CERTEZA que deseja EXCLUIR a trilha "${trilhaNome}"?`)) {
            try {
                await axios.delete(`${apiUrl}/api/admin/trilhas/${trilhaId}`);
                setTrilhas(trilhas.filter(t => t.id !== trilhaId));
            } catch (err) {
                alert("Erro ao excluir a trilha.");
            }
        }
    };

    const handleAction = async (trilhaId, status) => {
        const actionText = status === 'aprovada' ? 'aprovar' : 'rejeitar';
        if (window.confirm(`Tem certeza que deseja ${actionText} esta trilha?`)) {
            try {
                await axios.patch(`${apiUrl}/api/admin/trilhas/${trilhaId}/status`, { status });
                
                // Em vez de remover, atualizamos o status na UI para feedback visual
                setTrilhas(trilhas.map(t => {
                    if (t.id === trilhaId) {
                        // Se rejeitou, podemos remover da lista. Se aprovou, atualizamos.
                        return status === 'aprovada' ? { ...t, status: 'aprovada' } : null;
                    }
                    return t;
                }).filter(t => t !== null)); // Remove os nulos (rejeitados) da lista

            } catch (err) {
                alert(`Erro ao ${actionText} a trilha.`);
            }
        }
    };
    
    if (loading) return <div className="text-center p-5"><Spinner /></div>;

    return (
        <Container className="py-5">
            <h1 className="mb-4">Painel de Administração de Trilhas</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Imagem</th>
                        <th>Nome da Trilha</th>
                        <th>Autor</th>
                        <th>Status</th>
                        <th className="text-center">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {trilhas.length > 0 ? (
                        trilhas.map(trilha => {
                            const imageUrl = trilha.imagem_principal_url 
        ? `${apiUrl}/uploads/trilhas/${trilha.imagem_principal_url}` 
        : trailImagePlaceholder;
                            return (
                                <tr key={trilha.id}>
                                    <td><Image src={imageUrl} style={{ width: '120px', height: '70px', objectFit: 'cover', borderRadius: '4px' }} /></td>
                                    <td>{trilha.nome}</td>
                                    <td>{trilha.autor_nome}</td>
                                    <td>
                                        <span className={`badge bg-${trilha.status === 'aprovada' ? 'success' : 'warning'}`}>
                                            {trilha.status}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <ButtonGroup>
                                            <Link to={`/admin/trilhas/${trilha.id}`} className="btn btn-sm btn-info">Ver</Link>
                                            {/* --- A LÓGICA DE APROVAÇÃO/REJEIÇÃO ESTÁ AQUI --- */}
                                            {trilha.status === 'pendente' && (
                                                <>
                                                    <Button variant="success" size="sm" onClick={() => handleAction(trilha.id, 'aprovada')}>Aprovar</Button>
                                                    <Button variant="secondary" size="sm" onClick={() => handleAction(trilha.id, 'rejeitada')}>Rejeitar</Button>
                                                </>
                                            )}
                                            <Button variant="danger" size="sm" onClick={() => handleDelete(trilha.id, trilha.nome)}>
                                                Excluir
                                            </Button>
                                        </ButtonGroup>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr><td colSpan="5" className="text-center">Nenhuma trilha encontrada.</td></tr>
                    )}
                </tbody>
            </Table>
        </Container>
    );
};

export default PaginaAdmin;