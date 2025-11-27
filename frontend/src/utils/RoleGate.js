// src/utils/RoleGate.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const getRole = (isAuthenticated, user) => {
  if (!isAuthenticated) return 'guest';
  return user?.role || 'user';
};

const getRedirectPath = (role) => {
  if (role === 'admin') return '/admin';
  if (role === 'user') return '/';
  return '/login';
};

export const RoleGate = ({ allowedRoles = ['guest', 'user'], children }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const currentRole = getRole(isAuthenticated, user);

  if (!allowedRoles.includes(currentRole)) {
    return <Navigate to={getRedirectPath(currentRole)} replace />;
  }

  return children;
};

export default RoleGate;

