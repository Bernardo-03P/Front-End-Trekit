import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PaginaCadastro from './pages/PaginaCadastro';
import PaginaLogin from './pages/PaginaLogin';
import PaginaExplorar from './pages/PaginaExplorar';
import PaginaAdicionarTrilha from './pages/PaginaAdicionarTrilha';
import PaginaDetalhesTrilha from './pages/PaginaDetalhesTrilha';
import PaginaAdmin from './pages/PaginaAdmin';
import PaginaAdminDetalhes from './pages/PaginaAdminDetalhes';
import PaginaPerfil from './pages/PaginaPerfil';
import PaginaEditarPerfil from './pages/PaginaEditarPerfil';
import PaginaMinhasTrilhas from './pages/PaginaMinhasTrilhas';
import PrivateRoute from './auth/PrivateRoute';
import Layout from './componentes/Layout'; // Importação do Layout
import PaginaTermos from './pages/PaginaTermos';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas SEM Layout */}
        <Route path="/login" element={<PaginaLogin />} />
        <Route path="/cadastro" element={<PaginaCadastro />} />
        <Route path="/termos" element={<PaginaTermos />} />
        
        {/* Rotas COM Layout (Navbar + Footer) */}
        <Route path="/" element={<Layout />}>
          <Route element={<PrivateRoute />}>
            <Route index element={<PaginaExplorar />} />
            <Route path="/explorar" element={<PaginaExplorar />} />
            <Route path="/minhas-trilhas" element={<PaginaMinhasTrilhas />} />
            <Route path="/adicionar-trilha" element={<PaginaAdicionarTrilha />} />
            <Route path="/trilhas/:id" element={<PaginaDetalhesTrilha />} />
            <Route path="/perfil/:id" element={<PaginaPerfil />} />
            <Route path="/editar-perfil/:id" element={<PaginaEditarPerfil />} />
            <Route path="/admin" element={<PaginaAdmin />} />
            <Route path="/admin/trilhas/:id" element={<PaginaAdminDetalhes />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;