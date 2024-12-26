import { googleLogout } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import './SideBar.css';

export default function Sidebar({ children }) {
  const navigate = useNavigate();
  const profile = JSON.parse(localStorage.getItem('userProfile'));

  const handleLogout = () => {
    console.log('Logout triggered');
    googleLogout();
    localStorage.removeItem('userProfile');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <img
          src="http://www.extra.com.tn/assets/img/logoExtra.png"
          alt="Extra Logo"
          style={{ height: 'auto' }}
        />
      </div>

      <div>
        <ul className="rounded-lg">
          <Link to="/employee/TeamActivity" className="sidebar-link">
            <li className="p-3 hover:bg-gray-700">Activité d'équipe</li>
          </Link>
          <Link to="/employee/Listeofemployees" className="sidebar-link">
            <li className="p-3 hover:bg-gray-700">Liste d'employées</li>
          </Link>
          <Link to="/public-holidays" className="sidebar-link">
            <li className="p-3 hover:bg-gray-700">Jours fériés</li>
          </Link>
          {children}
        </ul>
      </div>

      {profile && (
        <div className="user-profile flex items-center p-3 bg-[#FFE328] rounded-lg">
          <img
            src={profile.picture}
            alt={profile.name}
            className="rounded-circle"
            width="32"
            height="32"
          />
          <span className="ms-2 text-lg font-semibold">{profile.name}</span>
        </div>
      )}

      <div className="logout-container">
        <button onClick={handleLogout} className="logout-btn">
          Déconnecter
        </button>
      </div>
    </aside>
  );
}
