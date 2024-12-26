import React from 'react';
import './Navbar.css';

const Navbar = ({ userProfile }) => {

  return (
    <nav className="navbar navbar-expand-lg fixed-top navbar-scroll">
      <div className="container-fluid">
        <h2>Activité d'équipe</h2>
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <a href="#notifications" className="nav-link">
              <i className="fas fa-bell"></i>
            </a>
          </li>
          <li className="nav-item">
            <a href="#user-profile" className="nav-link">
              {userProfile ? (
                <>
                  <img
                    src={userProfile?.picture}
                    alt="***"
                    className="rounded-circle"
                    width="32"
                    height="32"
                  />
                  <span className="ms-2">{userProfile.name}</span>
                </>
              ) : (
                <span>Loading...</span>
              )}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
