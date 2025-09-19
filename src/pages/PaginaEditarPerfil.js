import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Form, Button, Alert, Spinner, Image } from 'react-bootstrap';
// ----> CORREÇÃO 1: Adicione 'PencilSquare' aqui <----
import { ArrowLeft, PencilSquare } from 'react-bootstrap-icons';
import axios from 'axios';

import logo from '../assets/icons/logo.svg'; 
import '../PaginaEditarPerfil.css'; 
const apiUrl = process.env.REACT_APP_API_URL;
const PaginaEditarPerfil = () => {
    // Seus states e hooks originais
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ nome: '', username: '', email: '', bio: '' });
    // ----> CORREÇÃO 2: Adicione os states para novaSenha <----
    const [novaSenha, setNovaSenha] = useState(''); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    // --- Sua lógica de fetch e handle (ESTÁ PERFEITA) ---
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const response = await axios.get(`${apiUrl}/api/users/${id}`, config);
                const userData = response.data;
                setFormData({
                    nome: userData.nome || '',
                    username: userData.username || '',
                    email: userData.email || '',
                    bio: userData.bio || '',
                });
                if (userData.avatar_url) {
                    setPreview(userData.avatar_url);
                }
            } catch (err) {
                setError('Não foi possível carregar os dados do seu perfil.');
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [id]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            // Cria um preview local para a nova imagem
            URL.revokeObjectURL(preview); // Limpa o preview anterior da memória
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Função de submit completa, sem alterações na lógica
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // 1. Tenta fazer upload do avatar PRIMEIRO
        if (selectedFile) {
            const uploadFormData = new FormData();
            uploadFormData.append('avatar', selectedFile);
            try {
                const token = localStorage.getItem('authToken');
                const config = { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } };
                // A resposta da API de avatar já contém o usuário atualizado
                const response = await axios.put(`${apiUrl}/api/users/${id}/avatar`, uploadFormData, config);
                localStorage.setItem('user', JSON.stringify(response.data));
            } catch (uploadError) {
                setError('Erro ao fazer upload do novo avatar.');
                return; // Para a execução se o upload falhar
            }
        }
        
        // 2. Tenta atualizar os outros dados do formulário
        try {
            const token = localStorage.getItem('authToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.put(`${apiUrl}/api/users/${id}`, formData, config);
            
            // Atualiza o localStorage com a versão mais recente dos dados
            const userFromStorage = JSON.parse(localStorage.getItem('user'));
            const updatedUser = { ...userFromStorage, ...response.data };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setSuccess('Perfil atualizado com sucesso!');
            setTimeout(() => navigate(`/perfil/${id}`), 1500);
        } catch (err) {
            setError('Erro ao atualizar os dados do perfil.');
        }
    };
    
    if (loading) return <div className="text-center p-5"><Spinner /></div>;

    // --- NOVA ESTRUTURA VISUAL (JSX) ---
    return (
        <div className="edit-profile-page">
            <header className="edit-profile-header">
                <Link to={`/perfil/${id}`} className="btn-voltar d-flex align-items-center">
                    <ArrowLeft /> Voltar
                </Link>
            </header>

            <Form onSubmit={handleSubmit} className="edit-form">
                <div className="avatar-editor" onClick={() => fileInputRef.current.click()}>
                    <Image src={preview || `https://i.pravatar.cc/150?u=${id}`} className="avatar-image" />
                    <div className="avatar-overlay">
                        <PencilSquare size={30} />
                    </div>
                </div>
                <Form.Control type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" hidden />
                
                <div className="text-center mb-4" style={{minHeight: '50px'}}>
                     {error && <Alert variant="danger">{error}</Alert>}
                     {success && <Alert variant="success">{success}</Alert>}
                </div>
               
                <Form.Group className="edit-form-group">
                    <div className="edit-input-wrapper">
                        <Form.Control className="edit-input" type="text" name="nome" value={formData.nome} onChange={handleChange} placeholder="Nome Legal"/>
                        <PencilSquare className="edit-input-icon" />
                    </div>
                </Form.Group>
                
                <Form.Group className="edit-form-group">
                    <div className="edit-input-wrapper">
                         <Form.Control className="edit-input" type="text" name="username" value={formData.username} onChange={handleChange} placeholder="@tananana" />
                         <PencilSquare className="edit-input-icon" />
                    </div>
                </Form.Group>
                
                <Form.Group className="edit-form-group">
                    <div className="edit-input-wrapper">
                         <Form.Control className="edit-input" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@gmail.com"/>
                         <PencilSquare className="edit-input-icon" />
                    </div>
                </Form.Group>
                
                <Form.Group className="edit-form-group">
                    <div className="edit-input-wrapper">
                         <Form.Control className="edit-input" type="password" name="novaSenha" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} placeholder="Nova senha (deixe em branco para manter)"/>
                         <PencilSquare className="edit-input-icon" />
                    </div>
                </Form.Group>

                <div className="action-buttons">
                    <Button variant="light" className="btn-cancelar" onClick={() => navigate(`/perfil/${id}`)}>Cancelar</Button>
                  <Button type="submit" className="btn-salvar" style={{ backgroundColor: '#34A853', borderColor: '#34A853' }}>Salvar</Button>
                </div>

            </Form>
        </div>
    );
};

export default PaginaEditarPerfil;