import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Calendar from "./Calendar";
import "./Profile.css";
import Sidebar from "./SideBar";
import { StatisticsCard } from "./StatisticsCard";

export default function EmployeeProfile() {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [statistics, setStatistics] = useState(null);
  const handleDataFetched = useCallback((data) => {
    setStatistics(data);
  }, []);
  const handleViewDetails = () => {
    navigate(`/employee/${employeeId}/details`);
  };
  // Reusable function to handle API calls
  const fetchData = async (url, callback) => {
    try {
      const response = await axios.get(url);
      callback(response.data);
    } catch (err) {
      console.error(`Error fetching data from ${url}:`, err);
      setError("Échec de la récupération des données.");
    }
  };

  // Fetch Employee Details
  const fetchEmployeeDetails = useCallback(() => {
    fetchData(`http://localhost:3000/employees/${employeeId}`, setEmployeeDetails);
  }, [employeeId]);

  // Fetch Employee Activities
  const fetchActivities = useCallback(() => {
    fetch(`http://localhost:3000/activities/employee/${employeeId}/${year}/${month}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched activities:", data);
        setActivities(data);
      })
      .catch((err) => {
        console.error("Error fetching activities:", err);
        setError("Failed to load activities.");
      });
  }, [employeeId, year, month]);
  // Fetch Leave Summary
  /* const fetchLeaveSummary = useCallback(async () => {
    try {
      // Call the new API route
      const response = await axios.get(
        `http://localhost:3000/employee-summary/yearly-summary/${employeeId}/${year}`
      );

      // Parse the response to update summaries and yearly summary
      const { summaries, yearlySummary } = response.data;
      
      setLeaveSummaries(summaries);
      setYearlySummary(yearlySummary);
    } catch (err) {
      console.error("Error fetching leave summary:", err);
      setError("Échec de la récupération des résumés de congé.");
    } finally {
      setLoading(false);
    }
  }, [employeeId, year]); */


  // Fetch Employee Details and Activities on Component Mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchEmployeeDetails(), fetchActivities(), /* fetchLeaveSummary() */]);
      } catch (err) {
        console.error("Error fetching employee details, activities, or leave summaries:", err);
        setError("Échec de la récupération des détails de l'employé, des activités ou des résumés de congé.");
      } finally {
        setLoading(false);
      }
    };
  
    loadData();
  }, [fetchEmployeeDetails, fetchActivities]);
  
   const handleMonthChange = (activeStartDate) => {
    setYear(activeStartDate.getFullYear());
    setMonth(activeStartDate.getMonth() + 1);
  };
  /* const handleBack = () => {
    navigate("/employee/TeamActivity");
  }; */

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  if (!statistics) {
    return (
        <>
            <StatisticsCard
                employeeId={employeeId}
                year={year}
                onDataFetched={handleDataFetched}
            />
            <p>Loading...</p>
        </>
    );
}

//const {  yearlySummary, monthlyBreakdown } = statistics;


  
return (
  <div className="main-container">
    {/* Main Container with Margin */}
    <div className="container-fluid" style={{ padding: '30px 100px' }}>
      {/* Sidebar */}
      <Sidebar />

      <div className="row">
  {/* Employee Details Card */}
  <div className="col-md-3">
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <div className="employee-header d-flex align-items-center mb-3">
          {employeeDetails ? (
            <>
              <img
                src={employeeDetails.profile_image}
                alt="employee"
                className="rounded-circle mr-3"
                width="45"
                height="45"
              />
              <div>
                <h5 className="mb-0">
                  {employeeDetails.prenom} {employeeDetails.nom}
                </h5>
                <span className="text-success font-weight-bold">
                  {employeeDetails.status ?? 'Active'}
                </span>
              </div>
            </>
          ) : (
            <p>Aucun détail disponible.</p>
          )}
        </div>
        {employeeDetails ? (
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <strong>Email:</strong> {employeeDetails.email}
            </li>
            <li className="list-group-item">
              <strong>Numéro de tél:</strong> {employeeDetails.numerodetel}
            </li>
            <li className="list-group-item">
              <strong>Fonction:</strong> {employeeDetails.fonction}
            </li>
          </ul>
        ) : (
          <p>Aucun détail disponible.</p>
        )}
      </div>
    </div>
  </div>

  {/* Calendar and Leave Summary */}
  <div className="col-md-9">
    <div className="d-flex flex-wrap justify-content-between">
      {/* Calendar Card */}
      <div className="card shadow-sm mb-4 flex-fill mr-3" style={{ flex: "1 1 48%" }}>
        <div className="card-body">
          <h4 className="resume-title mb-4">Calendrier des absences</h4>
          <Calendar activities={activities} onMonthChange={handleMonthChange} />
          <button className="btn btn-primary mt-3" onClick={handleViewDetails}>
            Plus de détails
          </button>
        </div>
      </div>

      {/* Leave Summary Card */}
      <div className="card shadow-sm mb-4 flex-fill" style={{ flex: "1 1 48%" }}>
        <div className="card-body">
          <h4 className="resume-title mb-4">Résumé Annuel des Congés</h4>
          {statistics?.yearlySummary ? (
            <div className="yearly-summary">
              <p>
                <strong>Total Acquis :</strong> {statistics.yearlySummary.totalPaidLeaveBalance} jours
              </p>
              <p>
                <strong>Total Utilisé (Payé) :</strong> {statistics.yearlySummary.totalLeaveUsedPaid} jours
              </p>
              <p>
                <strong>Total Utilisé (Non-Payé) :</strong> {statistics.yearlySummary.totalLeaveUsedUnpaid} jours
              </p>
              <p>
                <strong>Solde Restant :</strong> {statistics.yearlySummary.finalRemainingPaidLeave} jours
              </p>
            </div>
          ) : (
            <p>Chargement des données annuelles...</p>
          )}

          <h4 className="mt-4">Répartition Mensuelle</h4>
          {statistics?.monthlyBreakdown?.length > 0 ? (
            <ul className="list-group">
              {statistics.monthlyBreakdown.map((entry, index) => (
                <li key={index} className="list-group-item">
                  <strong>Mois:</strong> {entry.month} |{' '}
                  <strong>Acquis:</strong> {entry.paidLeaveBalance} jours |{' '}
                  <strong>Utilisé (Payé):</strong> {entry.usedPaidLeave} jours |{' '}
                  <strong>Utilisé (Non-Payé):</strong> {entry.usedUnpaidLeave} jours |{' '}
                  <strong>Restant:</strong> {entry.remainingPaidLeave} jours
                </li>
              ))}
            </ul>
          ) : (
            <p>Chargement des données mensuelles...</p>
          )}
        </div>
      </div>
    </div>
  </div>
  </div>

      {/* Statistics Fetching Logic */}
      <StatisticsCard
        employeeId={employeeId}
        year={year}
        onDataFetched={handleDataFetched}
      />
    </div>
  </div>
);

  
  
}
