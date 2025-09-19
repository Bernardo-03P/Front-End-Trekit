import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const authToken = localStorage.getItem('authToken');

  // Se o token existe, renderiza a página filha (usando <Outlet />).
  // Se não existe, redireciona para a página de login.
  return authToken ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;