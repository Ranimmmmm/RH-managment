import React, { useState, useEffect} from 'react';
import { Link ,useNavigate  } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import './TeamActivityDashboard.css';
import Navbar from './Navbar';
import SideBar from './SideBar';
import CalendarBase from '../UI/CalendarBase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const TeamActivityDashboard = () => {
  const [teamActivity, setTeamActivity] = useState([]);
  const [timeEntries, setTimeEntries] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [userProfile, setUserProfile]= useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [updateTimeout, setUpdateTimeout] = useState(null);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const navigate = useNavigate();
  useEffect(() => {
    // Retrieve user profile from localStorage
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
    } else {
      // If no user is logged in, redirect to login page
      navigate('/');
    }
  }, [navigate]);

  // Logout function
  
  useEffect(() => {
    fetchDataByDate(selectedDate);
  }, [selectedDate]);

  const fetchDataByDate = (date) => {
    axios
      .get('http://localhost:3000/activities/getbyDate', { params: { date } })
      .then((response) => {
        setTeamActivity(response.data);
        const initialTimeEntries = response.data.reduce((acc, employee) => {
          const activity = employee.Activities[0] || {};
          acc[employee.id] = {
            activityId: activity.id || '',
            inTime: activity.inTime || '',
            outTime: activity.outTime || '',
            status: activity.status || 'présent',
            numberOfMissions: activity.numberOfMissions || 0,
            actionDate: activity.actionDate || date,
            employeeName: `${employee.prenom} ${employee.nom}`,
          };
          return acc;
        }, {});
        setTimeEntries(initialTimeEntries);
      })
      .catch(() => {
        setErrorMsg('Failed to fetch data for the selected date');
      });
  };

  const handleChange = (employeeId, field, value) => {
    setTimeEntries((prev) => {
      const updatedEntries = {
        ...prev,
        [employeeId]: {
          ...prev[employeeId],
          [field]: value,
        },
      };

      if (field === 'status' && value === 'congé') {
        updatedEntries[employeeId].inTime = '';
        updatedEntries[employeeId].outTime = '';
      }

      sendUpdateToServer(employeeId, updatedEntries[employeeId]);

      if (updateTimeout) clearTimeout(updateTimeout);
      setUpdateTimeout(
        setTimeout(() => {
          toast.info('Les données ont été sauvegardées automatiquement.', {
            icon: <FontAwesomeIcon icon={faCheckCircle} color="#ffffff" />,
            style: { backgroundColor: '#28a745', color: '#ffffff' },
            progressStyle: { backgroundColor: '#ffffff' },
            autoClose: 5000,
            position: 'top-right',
          });
        }, 5000)
      );

      return updatedEntries;
    });
  };

  const sendUpdateToServer = (employeeId, activityData) => {
    const postData = {
      activityId: activityData.activityId,
      employeeId: parseInt(employeeId, 10),
      inTime: activityData.inTime,
      outTime: activityData.outTime,
      status: activityData.status,
      numberOfMissions: parseInt(activityData.numberOfMissions, 10),
      actionDate: moment(activityData.actionDate).isValid()
        ? moment(activityData.actionDate).format('YYYY-MM-DD')
        : moment().format('YYYY-MM-DD'),
    };

    axios
      .post('http://localhost:3000/activities/save', postData)
      .catch((error) => {
        setErrorMsg(`Failed to update activity: ${error.response?.data?.message || 'Unknown error'}`);
      });
  };

  const filteredTeamActivity = teamActivity.filter((employee) =>
    `${employee.prenom} ${employee.nom}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard-container">
        <aside>
          <SideBar />
        </aside>
          {errorMsg && <p>{errorMsg}</p>}
          <div className="activity-table-container">
            <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} userProfile={userProfile}  />
            <div className="table-section"> <table className="table table-hover">
           <thead className="table-dark border-0 shadow-sm">
            <tr>
              <th>Employee</th>
              <th>Heure d'entrée</th>
              <th>Heure de Départ</th>
              <th>Status</th>
              <th>Nbre de mission</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeamActivity.map((employee) => (
              <tr key={employee.id}>
                <td>
                  <Link to={`/employee/${employee.id}/${currentYear}/${currentMonth}`}>
                    {timeEntries[employee.id]?.employeeName}
                  </Link>
                </td>
                <td>
                  <input
                    type="time"
                    value={timeEntries[employee.id]?.inTime || ''}
                    onChange={(e) => handleChange(employee.id, 'inTime', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="time"
                    value={timeEntries[employee.id]?.outTime || ''}
                    onChange={(e) => handleChange(employee.id, 'outTime', e.target.value)}
                  />
                </td>
                <td>
                  <select
                    value={timeEntries[employee.id]?.status || 'absent'}
                    onChange={(e) => handleChange(employee.id, 'status', e.target.value)}
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="congé">Congé</option>
                    <option value="férié">Férié</option>
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    className="inputnumber-misisons"
                    value={timeEntries[employee.id]?.numberOfMissions || 0}
                    onChange={(e) => handleChange(employee.id, 'numberOfMissions', e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> </div>

          
  
      <div className="col-md-3">
        <div className="calendar-container">
          <CalendarBase selectedDate={selectedDate} onDateChange={setSelectedDate} />
        </div>
      </div>
      <SideBar  />
  
      
  
      <ToastContainer />
    </div>
  );
};

export default TeamActivityDashboard;
