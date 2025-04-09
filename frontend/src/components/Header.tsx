// src/components/Header.tsx
import React from 'react';

const Header: React.FC = () => {
  return (
    <header>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>[Icon]</span>
          <span style={{ marginLeft: '8px' }}>CinNiche</span>
        </div>
        <button>Login</button>
      </div>
    </header>
  );
};

export default Header;
