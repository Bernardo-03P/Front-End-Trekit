import React from 'react';
import { Container, Card} from 'react-bootstrap';
import { Link } from 'react-router-dom';

const PaginaTermos = () => {
    return (
        // Envolve tudo em um container flex para centralizar o card
        <Container fluid className="d-flex justify-content-center align-items-center py-5 bg-light" style={{ minHeight: '100vh' }}>
            <Card className="shadow-sm" style={{ maxWidth: '800px', width: '100%' }}>
                <Card.Header as="h2" className="text-center py-3">Termos e Condições de Uso</Card.Header>
                <Card.Body className="p-4 p-md-5" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <p className="text-muted text-center">Última atualização: 25 de Setembro de 2025</p>
                    
                    <p><strong>Bem-vindo ao Trekit!</strong></p>
                    <p>Estes termos e condições descrevem as regras e regulamentos para o uso do site da Trekit. Ao acessar este site, presumimos que você aceita estes termos e condições na íntegra. Não continue a usar o site da Trekit se você não concordar com todos os termos e condições declarados nesta página.</p>

                    <h5 className="mt-4">1. Contas de Usuário</h5>
                    <p>Ao criar uma conta conosco, você deve nos fornecer informações que sejam precisas, completas e atuais em todos os momentos. A falha em fazer isso constitui uma violação dos Termos, que pode resultar na rescisão imediata da sua conta em nosso Serviço. Você é responsável por proteger a senha que usa para acessar o Serviço e por quaisquer atividades ou ações sob sua senha.</p>

                    <h5 className="mt-4">2. Conteúdo Gerado pelo Usuário</h5>
                    <p>Nosso Serviço permite que você poste, vincule, armazene, compartilhe e, de outra forma, disponibilize certas informações, textos, gráficos, vídeos ou outros materiais ("Conteúdo"). Você é responsável pelo Conteúdo que você posta no ou através do Serviço, incluindo sua legalidade, confiabilidade e adequação.</p>
                    <p>Ao postar Conteúdo, você nos concede o direito e a licença para usar, modificar, executar publicamente, exibir publicamente, reproduzir e distribuir tal Conteúdo no e através do Serviço. Você retém todos os seus direitos sobre qualquer Conteúdo que enviar, postar ou exibir e é responsável por proteger esses direitos.</p>

                    <h5 className="mt-4">3. Moderação e Aprovação de Conteúdo</h5>
                    <p>Todas as trilhas enviadas pelos usuários estão sujeitas à revisão e aprovação pela equipe de administração da Trekit. Reservamo-nos o direito de rejeitar ou remover qualquer trilha que não cumpra com nossas diretrizes de qualidade e segurança, a nosso exclusivo critério e sem aviso prévio.</p>

                    <h5 className="mt-4">4. Propriedade Intelectual</h5>
                    <p>O Serviço e seu conteúdo original (excluindo o Conteúdo fornecido pelos usuários), características e funcionalidades são e continuarão sendo propriedade exclusiva da Trekit e de seus licenciadores. O Serviço está protegido por direitos autorais, marcas registradas e outras leis do Brasil e de outros países.</p>

                    <h5 className="mt-4">5. Links para Outros Sites</h5>
                    <p>Nosso Serviço pode conter links para sites ou serviços de terceiros que não são de propriedade ou controlados pela Trekit. A Trekit não tem controle e não assume responsabilidade pelo conteúdo, políticas de privacidade ou práticas de quaisquer sites ou serviços de terceiros.</p>
                    
                    <h5 className="mt-4">6. Lei Aplicável</h5>
                    <p>Estes Termos serão regidos e interpretados de acordo com as leis do Brasil, sem consideração com seu conflito de provisões legais.</p>

                    <p className="mt-4">Ao continuar a acessar ou usar nosso Serviço, você concorda em ficar vinculado a estes Termos. Se você não concordar com os termos, você não tem permissão para usar o Serviço.</p>

                </Card.Body>
                <Card.Footer className="text-center p-3">
                    <Link 
                        to="/cadastro" 
                        state={{ termsAccepted: true }} 
                        className="btn btn-success btn-lg"
                    >
                        Li e Aceito, Voltar para o Cadastro
                    </Link>
                </Card.Footer>
            </Card>
        </Container>
    );
};

export default PaginaTermos;