import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const TermosModal = ({ show, handleClose }) => {
    // Texto legal mais completo para dar mais profissionalismo à página
    const termos = `
**Bem-vindo ao Trekit!**

Estes Termos e Condições de Uso ("Termos") descrevem as regras e regulamentos para a utilização do site Trekit ("Serviço"), operado por Trekit Inc. Ao acessar ou usar nosso Serviço, você concorda em cumprir e estar vinculado a estes Termos. Se você não concordar com qualquer parte dos termos, não terá permissão para acessar o Serviço.

**1. Contas de Usuário**

Ao criar uma conta conosco, você garante que tem mais de 18 anos e que as informações fornecidas são precisas, completas e atuais em todos os momentos. A violação desta cláusula pode resultar na rescisão imediata da sua conta em nosso Serviço. Você é responsável por proteger a senha que usa para acessar o Serviço e por quaisquer atividades ou ações sob sua senha.

**2. Conteúdo Gerado pelo Usuário**

Nosso Serviço permite que você publique informações, textos, gráficos, ou outros materiais ("Conteúdo"). Você é o único responsável pelo Conteúdo que posta, incluindo sua legalidade, confiabilidade e adequação.

Ao postar Conteúdo no Serviço, você nos concede o direito e a licença para usar, modificar, executar publicamente, exibir publicamente, reproduzir e distribuir tal Conteúdo. Você retém todos os seus direitos sobre qualquer Conteúdo que enviar, postar ou exibir e é responsável por proteger esses direitos. Você declara e garante que: (i) o Conteúdo é seu ou você tem o direito de usá-lo e de nos conceder os direitos e a licença conforme previsto nestes Termos, e (ii) a publicação do seu Conteúdo no ou através do Serviço não viola os direitos de privacidade, publicidade, direitos autorais, direitos contratuais ou quaisquer outros direitos de qualquer pessoa.

**3. Moderação e Aprovação de Conteúdo**

Todas as trilhas enviadas pelos usuários estão sujeitas à revisão e aprovação pela equipe de administração da Trekit. Reservamo-nos o direito, a nosso exclusivo critério, de rejeitar, remover ou editar qualquer Conteúdo que viole estes Termos ou que seja de outra forma questionável, sem aviso prévio.

**4. Propriedade Intelectual**

O Serviço e seu conteúdo original (excluindo o Conteúdo fornecido pelos usuários), características e funcionalidades são e permanecerão sendo propriedade exclusiva da Trekit e de seus licenciadores. O nosso nome e logotipos são marcas registradas da Trekit, e não podem ser usados em conexão com qualquer produto ou serviço sem o consentimento prévio por escrito da Trekit.

**5. Lei Aplicável**

Estes Termos serão regidos e interpretados de acordo com as leis da República Federativa do Brasil, sem consideração com seu conflito de provisões legais.

**6. Alterações nos Termos**

Reservamo-nos o direito, a nosso exclusivo critério, de modificar ou substituir estes Termos a qualquer momento. Se uma revisão for material, tentaremos fornecer um aviso com pelo menos 30 dias de antecedência antes que quaisquer novos termos entrem em vigor.

Ao continuar a acessar ou usar nosso Serviço após essas revisões se tornarem eficazes, você concorda em ficar vinculado aos termos revisados.
    `;

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Políticas e Condições de Uso</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <p className="text-muted">Última atualização: 25 de Setembro de 2025</p>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{termos}</div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleClose}>
                    Fechar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TermosModal;