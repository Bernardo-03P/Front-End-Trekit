import React, { useState } from 'react'; // <-- Adiciona o useState
import { Container } from 'react-bootstrap';
// Removido o Link, pois não vamos mais navegar para outra página
import TermosModal from './TermosModal'; // <-- Importa o componente do modal
const apiUrl = process.env.REACT_APP_API_URL;
const Footer = () => {
    const currentYear = new Date().getFullYear();

    // ----> INÍCIO DA LÓGICA DO MODAL <----
    // Cria um estado para controlar a visibilidade do modal
    const [showModal, setShowModal] = useState(false);

    // Funções para abrir e fechar o modal
    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    // ----> FIM DA LÓGICA DO MODAL <----

    return (
        <>
            <footer className="footer-custom mt-auto py-3">
                <Container className="text-center">
                    <span className="text-muted">© Trekit {currentYear}. Todos os direitos reservados.</span>
                    
                    {/* O link agora é uma tag <a> que chama a função para abrir o modal */}
                    <a href="#termos" onClick={handleOpenModal} className="footer-link ms-3">
                        Políticas e Condições de Uso
                    </a>
                </Container>
            </footer>

            {/* O Modal está sempre aqui, mas só aparece quando "showModal" for true */}
            <TermosModal show={showModal} handleClose={handleCloseModal} />
        </>
    );
};

export default Footer;