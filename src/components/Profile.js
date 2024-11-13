import React, { useEffect, useState , useCallback} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
export default function EmployeeProfile() {
    const { employeeId } = useParams();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isJournalVisible, setIsJournalVisible] = useState(false);

    
    // State for start and end dates
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    const [endDate, setEndDate] = useState(new Date());

    // Fetch activities within a date range
    const fetchActivitiesByDateRange = useCallback(() => {
        if (employeeId && startDate && endDate) {
            setLoading(true);
            const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
            const formattedEndDate = moment(endDate).format('YYYY-MM-DD');

            axios.get(`http://localhost:3000/activities/employee/${employeeId}/getByDateRange`, {
                params: {
                    startDate: formattedStartDate,
                    endDate: formattedEndDate,
                },
            })
            .then(response => {
                const groupedActivities = response.data;

                if (Array.isArray(groupedActivities)) {
                    // Create a map of activities by date for easy lookup
                    const activitiesMap = groupedActivities.reduce((acc, activity) => {
                        const date = moment(activity.date).format('YYYY-MM-DD');
                        acc[date] = activity;
                        return acc;
                    }, {});

                    // Generate all dates within the range and fill in missing dates
                    const dateRangeActivities = [];
                    let currentDate = moment(startDate);

                    while (currentDate.isSameOrBefore(endDate, 'day')) {
                        const dateStr = currentDate.format('YYYY-MM-DD');
                        if (activitiesMap[dateStr]) {
                            dateRangeActivities.push(activitiesMap[dateStr]);
                        } else {
                            // Placeholder for dates with no activity
                            dateRangeActivities.push({
                                date: dateStr,
                                inTime: '--',
                                outTime: '--',
                                status: 'No activity',
                                numberOfMissions: 0
                            });
                        }
                        currentDate = currentDate.add(1, 'day');
                    }

                    setActivities(dateRangeActivities);
                } else {
                    console.error("Expected an array, got:", groupedActivities);
                    setActivities([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching data:", err);
                setError('Failed to fetch data');
                setLoading(false);
            });
        }
    }, [employeeId, startDate, endDate]);

    // Trigger fetch when employeeId, startDate, or endDate changes
    useEffect(() => {
        fetchActivitiesByDateRange();
    }, [fetchActivitiesByDateRange]);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorAlert message={error} />;
    if (!activities.length) return <NoActivitiesAlert />;

    const toggleJournalVisibility = () => {
        setIsJournalVisible(!isJournalVisible);
    };

    return (
        <div className="container-fluid mt-4">
            <DateRangeSelector startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />
            <StatisticsCard statistics={calculateStatistics(activities)} />

            <div className="text-center my-4">
                <button className="btn btn-primary" onClick={toggleJournalVisibility}>
                    {isJournalVisible ? "Hide Detailed Journal" : "Show Detailed Journal"}
                </button>
            </div>

            {isJournalVisible && <ActivityLog activities={activities} />}
        </div>
    );
}

function DateRangeSelector({ startDate, endDate, setStartDate, setEndDate }) {
    return (
        <div className="date-range-selector mb-4">
            <label>Date de début: </label>
            <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="dd/MM/yyyy"
            />
            <label className="ms-3">Date de fin: </label>
            <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="dd/MM/yyyy"
            />
        </div>
    );
}


function LoadingSpinner() {
    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
            </div>
        </div>
    );
}

function ErrorAlert({ message }) {
    return (
        <div className="container mt-4">
            <div className="alert alert-danger" role="alert">
                {message}
            </div>
        </div>
    );
}

function NoActivitiesAlert() {
    return (
        <div className="container mt-4">
            <div className="alert alert-info" role="alert">
                Aucune activité trouvée pour cette période.
            </div>
        </div>
    );
}

function StatisticsCard({ statistics }) {
    return (
        <div className="row mb-4">
            <div className="col-md-6">
                <div className="card h-100 border-0 shadow-sm">
                    <div className="card-header bg-primary text-white">
                        <h5 className="card-title mb-0">Résumé des Activités</h5>
                    </div>
                    <div className="card-body">
                        <ul className="list-group list-group-flush">
                            <StatisticItem label="Total Missions" value={statistics.totalMissions} badgeClass="bg-primary" />
                            <StatisticItem label="Jours de Congé" value={statistics.conge} badgeClass="bg-warning" />
                            <StatisticItem label="Absences" value={statistics.absent} badgeClass="bg-danger" />
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatisticItem({ label, value, badgeClass }) {
    return (
        <li className="list-group-item d-flex justify-content-between align-items-center">
            {label}
            <span className={`badge ${badgeClass} rounded-pill`}>{value}</span>
        </li>
    );
}

function ActivityLog({ activities }) {
    return (
        <div className="row">
            <div className="col">
                <div className="card border-0 shadow-sm">
                    <div className="card-header bg-dark text-white">
                        <h5 className="card-title mb-0">Journal Détaillé des Activités</h5>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Heure d'Arrivée</th>
                                        <th>Heure de Départ</th>
                                        <th>Statut</th>
                                        <th>Missions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activities.map((activity, index) => (
                                        <ActivityRow key={index} activity={activity} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ActivityRow({ activity }) {
    // Normalize the status to lowercase to match against the `statusClass` map
    const normalizedStatus = (activity.status || '').toLowerCase().trim();

    // Define the statusClass map
    const statusClass = {
        'congé': 'bg-warning',
        'présent': 'bg-success',
        'absent': 'bg-danger',
        'no activity': 'bg-secondary'
    }[normalizedStatus] || 'bg-secondary'; // default to 'No activity' color if status doesn't match

    console.log(`Date: ${activity.date}, Status: ${activity.status}, Normalized Status: ${normalizedStatus}`);

    return (
        <tr>
            <td>{moment(activity.date).isValid() ? moment(activity.date).format('DD-MM-YYYY') : 'Invalid Date'}</td>
            <td>{activity.inTime || '--'}</td>
            <td>{activity.outTime || '--'}</td>
            <td><span className={`badge ${statusClass}`}>{activity.status}</span></td>
            <td>{activity.numberOfMissions || 0}</td>
        </tr>
    );
}

function calculateStatistics(activities) {
    return activities.reduce((stats, activity) => {
        return {
            totalMissions: stats.totalMissions + (activity.numberOfMissions || 0),
            absent: stats.absent + (activity.status === 'absent' ? 1 : 0),
            conge: stats.conge + (activity.status === 'congé' ? 1 : 0),
        };
    }, { totalMissions: 0, absent: 0, conge: 0 });
}
