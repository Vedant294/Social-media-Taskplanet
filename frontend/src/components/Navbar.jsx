import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from './Avatar.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="app-navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <span className="navbar-brand-text">🌐 TaskPlanet</span>

        {/* Right side */}
        <div className="navbar-right">
          <Dropdown align="end">
            <Dropdown.Toggle as="div" className="avatar-toggle" bsPrefix="avatar-toggle">
              <Avatar src={user?.avatar} name={user?.name || ''} size={38} />
            </Dropdown.Toggle>
            <Dropdown.Menu className="navbar-dropdown">
              <div className="dropdown-user-info">
                <strong>{user?.name}</strong>
                <span>@{user?.username}</span>
              </div>
              <Dropdown.Divider />
              <Dropdown.Item onClick={logout} className="dropdown-logout">
                🚪 Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </nav>
  );
}
