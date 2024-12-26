import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import Sidebar from "./SideBar";
import Select from "react-select"; // Library for multi-select dropdowns

const EmployeeActivityHistory = () => {
  const { employeeId } = useParams();
  const [employeeDetails, setEmployeeDetails] = useState(null);


  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);

  // Multi-select filters
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);

  const monthOptions = moment.months().map((month, index) => ({
    value: String(index + 1).padStart(2, "0"),
    label: month,
  }));
  const currentYear = moment().year();
  const yearOptions = [
    { value: String(currentYear - 1), label: String(currentYear - 1) }, 
    { value: String(currentYear), label: String(currentYear) },  
    { value: String(currentYear + 1), label: String(currentYear + 1) }
  ];
  const groupActivitiesByDate = (activities) => {
    const grouped = activities.reduce((acc, activity) => {
      const date = moment(activity.actionDate).format("YYYY-MM-DD");
      if (!acc[date] || moment(activity.actionDate).isAfter(acc[date].actionDate)) {
        acc[date] = activity; // Keep only the latest activity for each date
      }
      return acc;
    }, {});
    return Object.values(grouped);
  };
  // Function to fetch activities
  const fetchActivities = () => {
    console.log("Employee ID:", employeeId);
    const queryParams = new URLSearchParams({
      employeeId,
      months: selectedMonths.map((m) => m.value).join(","),
      years: selectedYears.map((y) => y.value).join(","),
    }).toString();
  
    console.log("Query Params:", queryParams);
  
    fetch(`http://localhost:3000/activities?${queryParams}` ,setEmployeeDetails)
      .then((res) => res.json())
      .then((data) => {
        console.log("Data received from server:", data);
        setActivities(data);
        const groupedActivities = groupActivitiesByDate(data);
        setActivities(groupedActivities);
      })
      
      .catch((err) => {
        console.error("Error fetching activities:", err);
        setError("Failed to load activities.");
      });
  };
  // Fetch Employee Details
const fetchEmployeeDetails = () => {
  fetch(`http://localhost:3000/employees/${employeeId}`)
    .then((res) => res.json())
    .then((data) => {
      setEmployeeDetails(data);
    })
    .catch((err) => {
      console.error("Error fetching employee details:", err);
      setError("Failed to load employee details.");
    });
};

  useEffect(() => {
    fetchEmployeeDetails();
    fetchActivities();

  }, [employeeId, selectedMonths, selectedYears]);

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(
      `Historique des Activités de ${employeeDetails.prenom} ${employeeDetails.nom}`,
      10,
      10
    );
    const selectedMonthsText = selectedMonths.map((m) => m.label).join(", ");
  const selectedYearsText = selectedYears.map((y) => y.label).join(", ");
  const dateRangeText =
    selectedMonthsText && selectedYearsText
      ? `Période sélectionnée : ${selectedMonthsText} ${selectedYearsText}`
      : "Période sélectionnée : Toutes les dates";
      doc.text(dateRangeText, 10, 20);

    const tableData = activities.map((activity) => [
      moment(activity.actionDate).format("DD/MM/YYYY"),
      activity.inTime || "N/A",
      activity.outTime || "N/A",
      activity.status || "N/A",
      activity.numberOfMissions || "N/A",
    ]);
    console.log("Table data for PDF:", tableData);

    doc.autoTable({
      head: [["Date", "Heure d'entrée", "Heure de sortie", "Statut", "Nombre de missions"]],
      body: tableData,
    });

    doc.save(`historique_activites_${employeeDetails.prenom}_${employeeDetails.nom}.pdf`); 
   };

  return (
    <>
      <div className="activity-table-container">
        <h4 className="mb-4">Historique des Activités</h4>
        {employeeDetails ? (
        <ul className="list-group list-group-flush">
          <li className="list-group-item"><strong>Prénom :</strong> {employeeDetails.prenom}</li>
          <li className="list-group-item"><strong>Nom : </strong>{employeeDetails.nom}</li></ul>
      ):(<p className="text-danger">{error}</p>)}
        {error && <p className="text-danger">{error}</p>}

        {/* Multi-select Filters */}
        <div className="d-flex mb-3 gap-3">
          <div className="flex-grow-1">
            <label>Mois :</label>
            <Select
              options={monthOptions}
              isMulti
              onChange={setSelectedMonths}
              placeholder="Sélectionner les mois"
            />
          </div>

          <div className="flex-grow-1">
            <label>Année :</label>
            <Select
              options={yearOptions}
              isMulti
              onChange={setSelectedYears}
              placeholder="Sélectionner les années"
            />
          </div>

          <button className="btn btn-secondary align-self-end" onClick={fetchActivities}>
            Filtrer
          </button>
        </div>

        {/* Export to PDF Button */}
        <button className="btn btn-primary mb-3" onClick={exportToPDF}>
          Exporter en PDF
        </button>

        {/* Activities Table */}
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-white	"> Date</th>
                <th className="px-4 py-2 text-left text-white	">Heure d'entrée</th>
                <th className="px-4 py-2 text-left text-white	">Heure de sortie</th>
                <th className="px-4 py-2 text-left text-white	">Statut</th>
                <th className="px-4 py-2 text-left text-white	">Nombre de missions</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity, index) => (
                <tr key={index}>
                  <td>{moment(activity.actionDate).format("DD/MM/YYYY")}</td>
                  <td>{activity.inTime || "N/A"}</td>
                  <td>{activity.outTime || "N/A"}</td>
                  <td>{activity.status || "N/A"}</td>
                  <td>{activity.numberOfMissions || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Sidebar />
    </>
  );
};

export default EmployeeActivityHistory;