import React from 'react';
import './Navbar.css';

const Navbar = ({ userProfile }) => {

  return (
    <nav className="navbar navbar-expand-lg fixed-top navbar-scroll">
      <div className="container-fluid">
        <h2>Activité d'équipe</h2>
      </div>
    </nav>
  );
};

export default Navbar;
