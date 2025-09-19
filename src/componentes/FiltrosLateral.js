import React from 'react';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import { Funnel, Star } from 'react-bootstrap-icons'; // Importa a estrela vazia também

const FiltrosLateral = ({ filtros, handleFiltroChange, applyFilters, onClearFilters }) => {
    return (
        <Card className="filtros-card">
            <div className="filtros-header">
                <h5 className="mb-0">Filtrar</h5>
                {/* O Button agora é variant="link", que o deixa sem fundo */}
                <Button variant="link" size="sm" onClick={onClearFilters} className="btn-limpar-filtros">
                    <Funnel className="me-1"/>
                    Limpar Filtros
                </Button>
            </div>

            {/* ==== ESTRELAS CENTRALIZADAS ==== */}
            <Form.Group className="mb-3 text-center">
                <Form.Label className="d-block">Nota Trekit</Form.Label>
                <div className="text-secondary" style={{ fontSize: '1.2rem' }}>
                    <Star /><Star /><Star /><Star /><Star />
                </div>
            </Form.Group>
            
            <Form.Group className="mb-3">
                <Form.Label>Dificuldade</Form.Label>
                <Form.Select name="dificuldade" value={filtros.dificuldade} onChange={handleFiltroChange}>
                    <option value="">Qualquer</option>
                    <option value="Fácil">Fácil</option>
                    <option value="Moderado">Moderado</option>
                    <option value="Difícil">Difícil</option>
                    <option value="Muito Difícil">Muito Difícil</option>
                </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Bairro</Form.Label>
                 <Form.Select name="bairro" value={filtros.bairro} onChange={handleFiltroChange}>
                    <option value="">Qualquer</option>
                    <option value="Lagoa da Conceição">Lagoa da Conceição</option>
                    <option value="Rio Vermelho">Rio Vermelho</option>
                    <option value="Praia Mole">Praia Mole</option>
                 </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
                <Form.Label>Distância (km)</Form.Label>
                <Row className="g-2">
                    <Col><Form.Control name="distanciaMin" type="number" placeholder="Mín" value={filtros.distanciaMin} onChange={handleFiltroChange} /></Col>
                    <Col><Form.Control name="distanciaMax" type="number" placeholder="Máx" value={filtros.distanciaMax} onChange={handleFiltroChange} /></Col>
                </Row>
            </Form.Group>
            
            <Form.Group className="mb-3">
                <Form.Label>Sinalização</Form.Label>
                <Form.Select name="sinalizacao" value={filtros.sinalizacao} onChange={handleFiltroChange}>
                     <option value="">Qualquer</option>
                     <option value="Sim">Sim</option>
                     <option value="Pouco">Pouco</option>
                     <option value="Não">Não</option>
                     <option value="Muito">Muito</option>
                </Form.Select>
            </Form.Group>
        </Card>
    );
};

export default FiltrosLateral;