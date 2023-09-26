import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';  // Import the UUID package
import './Calendar.css';
import { API, graphqlOperation } from 'aws-amplify';
import { getCalendarEvent } from './graphql/queries';
import { updateCalendarEvent } from './graphql/mutations';

const Calendar = ({ uuid = uuidv4() }) => {
  const [hourlyBlocks, setHourlyBlocks] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState(null);
  const [shouldFetchData, setShouldFetchData] = useState(false);

  useEffect(() => {
    if (!shouldFetchData) return;

    const fetchData = async () => {
      try {
        const result = await API.graphql(graphqlOperation(getCalendarEvent, { uuid: uuid }));
        if (result.data.getCalendarEvent && result.data.getCalendarEvent.hourlyBlocks) {
          setHourlyBlocks(result.data.getCalendarEvent.hourlyBlocks);
        } else {
          setHourlyBlocks({});
        }
      } catch (error) {
        console.error('Could not fetch calendar data:', error);
        setHourlyBlocks({});
      }
      setShouldFetchData(false);  // Reset the flag
    };

    fetchData();
  }, [shouldFetchData, uuid]);

  const handleMouseDown = async (day, hour) => {
    setIsDragging(true);
    const newHourlyBlocks = { ...hourlyBlocks };
    const dayData = newHourlyBlocks[day] || {};
    dayData[hour] = !dayData[hour];
    newHourlyBlocks[day] = dayData;
    setHourlyBlocks(newHourlyBlocks);
    setDragValue(!dayData[hour]);
  
    try {
      const input = {
        id: uuid,
        uuid: uuid,
        hourlyBlocks: JSON.stringify(newHourlyBlocks),
      };
      const result = await API.graphql(graphqlOperation(updateCalendarEvent, { input }));
      console.log('Successfully updated DynamoDB:', result);
    } catch (error) {
      console.error('Could not update DynamoDB:', error);
    }
  };
  

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseEnter = (day, hour) => {
    if (isDragging) {
      const newHourlyBlocks = { ...hourlyBlocks };
      const dayData = newHourlyBlocks[day] || {};
      dayData[hour] = dragValue;
      newHourlyBlocks[day] = dayData;
      setHourlyBlocks(newHourlyBlocks);
    }
  };

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="calendar" onMouseUp={handleMouseUp}>
      <button onClick={() => setShouldFetchData(true)}>Fetch Data</button>
      <div className="calendar-row header">
        <div className="calendar-cell"></div>
        {days.map(day => (
          <div key={day} className="calendar-cell">{day}</div>
        ))}
      </div>
      {hours.map(hour => (
        <div key={hour} className="calendar-row">
          <div className="calendar-cell">{`${hour}:00`}</div>
          {days.map(day => (
            <div
              key={day}
              className={`calendar-cell ${hourlyBlocks[day] && hourlyBlocks[day][hour] ? 'selected' : ''}`}
              onMouseDown={() => handleMouseDown(day, hour)}
              onMouseEnter={() => handleMouseEnter(day, hour)}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Calendar;
