import React, { useState, useEffect } from 'react';
import axios from 'axios';

export function StatisticsCard({ employeeId, year, onDataFetched }) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                setIsLoading(true);

                // Fetch data from the backend
                const response = await axios.get(
                    `http://localhost:3000/employee-summary/yearly-summary/${employeeId}/${year}`
                );

                const {  yearlySummary, monthlyBreakdown ,statistics} = response.data;

                // Provide data to the parent via the callback
                onDataFetched({
                    yearlySummary,
                    monthlyBreakdown,
                    statistics,
                });
            } catch (err) {
                console.error("Error fetching statistics:", err);
                setError("Failed to fetch statistics.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchStatistics();
    }, [employeeId, year, onDataFetched]);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="text-danger">{error}</p>;
    }

    // Render nothing; this is only a logic component
    return null;
}
