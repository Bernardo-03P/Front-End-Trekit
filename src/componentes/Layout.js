import React from 'react';
import { Outlet } from 'react-router-dom';
import AppNavbar from './Navbar';
import Footer from './Footer';
const apiUrl = process.env.REACT_APP_API_URL;
// Este componente age como um "template"
const Layout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppNavbar />
      <main style={{ flex: '1 0 auto' }}>
        {/* <Outlet> é onde o conteúdo da página específica será renderizado */}
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
};

export default Layout;