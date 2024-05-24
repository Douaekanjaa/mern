// ProNav.jsx

import React from 'react';
import { useAuthProContext } from '../../context/AuthProContext';
import { useNavigate } from 'react-router-dom';

const ProNav = () => {
  const { authUser, logout } = useAuthProContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="pro-nav">
      <div className="pro-nav__content">
        <span className="pro-nav__welcome">
          Welcome, {authUser ? `${authUser.first_name} ${authUser.last_name}` : 'Guest'}
        </span>
        <button className="pro-nav__logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default ProNav;
