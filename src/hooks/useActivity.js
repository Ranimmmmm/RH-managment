// hooks/useActivity.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useActivity = (url) => {
    const [activity, setActivity] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3000/activities/all')
            .then(response => {
                setActivity(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching activities:', error);
                setError('Failed to fetch activities');
                setIsLoading(false);
            });
    }, [url]);

    const handleActivityChange = (index, field, value) => {
        const updatedActivities = [...activity];
        updatedActivities[index] = {...updatedActivities[index], [field]: value};
        setActivity(updatedActivities);
    };

    const handleSaveActivity = (activityData) => {
        axios.post(url, activityData)
            .then(response => {
                console.log('Activity saved successfully:', response.data);
            })
            .catch(error => {
                console.error('Error saving activity:', error);
            });
    };

    return {
        activity,
        isLoading,
        error,
        handleActivityChange,
        handleSaveActivity
    };
};

export default useActivity;
