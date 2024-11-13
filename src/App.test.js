import {  screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import TeamActivityDashboard from './components/TeamActivityDashboard';
import nock from 'nock';

// Mock the API endpoint
nock('http://localhost:3000')
  .get('/employees/all')
  .reply(200, [
    { id: 1, name: 'Jamel Bouali', email: 'example@example.com' },
    // Add more mock employees as necessary
  ]);

test('loads and displays employee data', async () => {
  <Router>
    (<TeamActivityDashboard />);

  </Router>

  // Wait for the data to be fetched and displayed
  await waitFor(() => {
    expect(screen.getByText('Jamel Bouali')).toBeInTheDocument();
  });
});
