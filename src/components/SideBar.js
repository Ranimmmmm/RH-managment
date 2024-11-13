import { googleLogout } from '@react-oauth/google';
import { Link, useLocation, useNavigate  } from 'react-router-dom'; 
import './SideBar.css'
export default function Sidebar({ children }) {
  const location = useLocation();
  const profile = location.state?.profile;
  const navigate = useNavigate();

  const handleLogout = () => {
    googleLogout();
    navigate('/login');
  };
  return (
    <aside className="sidebar">
      <div className="logo-container">
      <img src="http://www.extra.com.tn/assets/img/logoExtra.png" alt="Extra Logo" style={{ height: 'auto' }} />

      </div>

      <div>
        <ul className="rounded-lg">
          <Link to="/employee/Dashboard" className="sidebar-link"><li className="p-3 hover:bg-gray-700">Dashboard</li></Link>
          <Link to="/employee/TeamActivity" className="sidebar-link"><li className="p-3 hover:bg-gray-700">Activité d'équipe</li></Link>
          <Link to="/employee/listeofemployees" className="sidebar-link"><li className="p-3 hover:bg-gray-700">Liste d'employées</li></Link>
  
          {children}
        </ul>
      </div>
      {profile && (
        <div className='flex p-3 bg-[#FFE328] rounded-lg'>
          <div className={`flex justify-between items-center overflow-hidden transition-all `}>
          </div>
        </div>
        
      )}
      <div className="logout-container">
        <button onClick={handleLogout} className="logout-btn">Déconnecter</button>
      </div>
    </aside>
  );
}
