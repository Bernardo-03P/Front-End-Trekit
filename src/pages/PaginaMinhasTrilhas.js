import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import TrilhaCard from '../componentes/TrilhaCard';
const apiUrl = process.env.REACT_APP_API_URL;
const PaginaMinhasTrilhas = () => {
    const [trilhasCurtidas, setTrilhasCurtidas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    useEffect(() => {
        const fetchTrilhasCurtidas = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setError("Você precisa estar logado para ver suas trilhas favoritas.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const config = { headers: { 'Authorization': `Bearer ${token}` } };
                const response = await axios.get(`${apiUrl}/api/me/trilhas-curtidas`, config);
                setTrilhasCurtidas(response.data);
            } catch (err) {
                setError('Não foi possível carregar suas trilhas favoritas.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTrilhasCurtidas();
    }, []);

    const handleLikeChange = (trilhaId, newLikedState) => {
        if (!newLikedState) {
            setTrilhasCurtidas(currentTrilhas => 
                currentTrilhas.filter(trilha => trilha.id !== trilhaId)
            );
        }
    };
    
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    return (
        <main className="container page-wrapper" style={{marginTop: '4rem'}}>
            <div className="demonstracao_cards" style={{marginTop: '2rem', marginBottom: '2rem'}}>
                <h1 className="fw-bold">Minhas Trilhas Favoritas</h1>
            </div>

            <div className="Container_CardsTrilhas">
                {loading && <p className="loading-placeholder">Carregando...</p>}
                {error && <p className="loading-placeholder" style={{color:'red'}}>{error}</p>}

                {!loading && !error && (
                    <>
                        {trilhasCurtidas.length > 0 ? (
                            trilhasCurtidas.map(trilha => (
                                // ==== AQUI ESTÁ A CORREÇÃO ====
                                // Envolvemos o TrilhaCard em uma div com margem
                                <div key={trilha.id} style={{ marginBottom: '1.5rem' }}>
                                    <TrilhaCard 
                                        trilha={trilha}
                                        onLikeChange={handleLikeChange} 
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="alert-info" style={{padding: '2rem', textAlign: 'center', backgroundColor: '#eaf0eb', borderRadius: '1rem'}}>
                                <p>Você ainda não curtiu nenhuma trilha.</p>
                                <Link to="/explorar"> Explore algumas agora!</Link>
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
};

export default PaginaMinhasTrilhas;