import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- ÍCONES CUSTOMIZADOS ---
// Importamos os seus SVGs da pasta assets.
import { ReactComponent as IconeLocalizacao } from '../assets/icons/localização.svg';
import { ReactComponent as IconeDistancia } from '../assets/icons/distancia.svg';
import { ReactComponent as IconeSinalizacao } from '../assets/icons/sinalizacao.svg';
import { ReactComponent as IconeDificuldade } from '../assets/icons/dificuldade.svg';

// --- ÍCONES DA BIBLIOTECA ---
// Importamos apenas os que vamos usar.
import { Heart, HeartFill, Star, StarFill } from 'react-bootstrap-icons';

import '../TrilhaCard.css';
import trailImagePlaceholder from '../assets/trailImage.png';
const apiUrl = process.env.REACT_APP_API_URL;
const TrilhaCard = ({ trilha, onLikeChange }) => {
    const [isLiked, setIsLiked] = useState(trilha.is_liked_by_user);
    
   const imageUrl = trilha.imagem_principal_url 
        ? `${apiUrl}/uploads/trilhas/${trilha.imagem_principal_url}` 
        : trailImagePlaceholder;
        
    const handleLikeClick = async (e) => {
        e.preventDefault(); 
        e.stopPropagation();
        const token = localStorage.getItem('authToken');
        if (!token) {
            alert("Você precisa estar logado para curtir.");
            return;
        }
        const newLikedState = !isLiked;
        setIsLiked(newLikedState);
        if (onLikeChange) onLikeChange(trilha.id, newLikedState);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
           if (newLikedState) {
            await axios.post(`${apiUrl}/api/trilhas/${trilha.id}/like`, {}, config);
        } else {
            await axios.delete(`${apiUrl}/api/trilhas/${trilha.id}/like`, config);
        }
        } catch (err) {
            console.error("Erro ao curtir:", err);
            setIsLiked(!newLikedState);
            if (onLikeChange) onLikeChange(trilha.id, !newLikedState);
        }
    };
    
    if (!trilha) return null;

    return (
        <Link to={`/trilhas/${trilha.id}`} className="trilha-card-link">
            <div className="trilha-card-horizontal">

                <div className="trilha-card-img-wrapper">
                    <img src={imageUrl} alt={`Imagem da trilha ${trilha.nome}`} className="trilha-card-img" />
                </div>
                
                <div className="trilha-card-body">
                    <div className="like-icon-wrapper" onClick={handleLikeClick}>
                        {/* Usando os ícones da biblioteca para o coração */}
                        {isLiked ? <HeartFill size={22} color="#E74C3C" /> : <Heart size={22} />}
                    </div>
                    
                    <h2 className="trilha-card-title">{trilha.nome}</h2>
                    <p className="trilha-card-subtitle">feito por {trilha.autor_nome}</p>
                    <div className="star-rating">
                       <StarFill /><StarFill /><StarFill /><StarFill /><Star />
                    </div>
                    
                    <div className="trilha-info-grid">
                        {/* Usando seus ícones SVG para as informações */}
                        <div className="trilha-info-item"><IconeLocalizacao /> Bairro, {trilha.bairro}</div>
                        <div className="trilha-info-item"><IconeDistancia /> Distância: {trilha.distancia_km} km</div>
                        <div className="trilha-info-item"><IconeSinalizacao /> Sinalização: {trilha.sinalizacao}</div>
                        <div className="trilha-info-item"><IconeDificuldade /> Dificuldade: {trilha.dificuldade}</div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default TrilhaCard;