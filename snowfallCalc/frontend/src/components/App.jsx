import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

import backgroundImage from './assets/skierBackground.webp';



const App = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [locations, setLocations] = useState([]);
  const [averageSnowfall, setAverageSnowfall] = useState(null);

  const fetchAverageSnowfall = async () => {
    try {
      const response = await axios.get('http://localhost:5000/average_snowfall', {
        params: {
          start_date: startDate,
          end_date: endDate,
          location: locations
        }
      });
      setAverageSnowfall(response.data);
    } catch (error) {
      console.error("There was an error fetching the average snowfall!", error);
    }
  };

  return (
    <div className="App" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <h1>Snowfall Average Calculator</h1>
      <input
        type="date"
        value={startDate}
        onChange={e => setStartDate(e.target.value)}
      />
      <input
        type="date"
        value={endDate}
        onChange={e => setEndDate(e.target.value)}
      />
      
      <button onClick={fetchAverageSnowfall}>Get Average Snowfall</button>
      {averageSnowfall && (
        <>
          <h2>Average Snowfall</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Snowfall (cm)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(averageSnowfall)
                  .map(([location, avg]) => [location, (avg).toFixed(1)]) // Convert to centimeters and round to 1 decimal point
                  .sort((a, b) => b[1] - a[1]) // Sort from highest to lowest
                  .map(([location, avg]) => (
                    <tr key={location}>
                      <td>{location}</td>
                      <td>{avg}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      
      
    </div>
  );
};

export default App;