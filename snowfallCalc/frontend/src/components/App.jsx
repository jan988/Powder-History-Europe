import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

import backgroundImage from './assets/skierBackground.webp';

const apiUrl = 'https://powder-history-europe-backend.onrender.com';

const App = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [locations, setLocations] = useState([]);
  const [averageSnowfall, setAverageSnowfall] = useState(null);

  const [infoVisible, setInfoVisible] = useState(true); // Added state variable

  const fetchAverageSnowfall = async () => {
    try {
      const response = await axios.get(`${apiUrl}/average_snowfall`, {
        params: {
          start_date: startDate,
          end_date: endDate,
          location: locations
        }
      });
      setAverageSnowfall(response.data);

      setInfoVisible(false); // Hide info box on button click

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


      {infoVisible && ( // Conditionally render the info box
        <div className="info-box">
          <p>This website calculates the average snowfall for a selected period considering the last 80 years. It ignores the specific year.</p>
        </div>
      )}



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