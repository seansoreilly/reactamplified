import React, { useState, useEffect } from 'react';
// import { v4 as uuidv4 } from 'uuid';
import './Calendar.css';
import { API, graphqlOperation } from 'aws-amplify';
// import { getCalendarEvent } from './graphql/queries';
import { createCalendarEvent } from './graphql/mutations';
import { listCalendarEvents } from './graphql/queries';
import { deleteAllEvents } from './utils';

const Calendar = ({ uuid = "c359c11f-0593-4f0f-92c1-7f93d9783bd5" }) => {  // Replace "YourFixedUUIDHere" with your fixed UUID
  const [hourlyBlocks, setHourlyBlocks] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState(null);
  const [shouldFetchData, setShouldFetchData] = useState(false);

  useEffect(() => {
    if (!shouldFetchData) return;

    const fetchData = async () => {
      try {
        const result = await API.graphql(graphqlOperation(listCalendarEvents));
        const aggregatedHourlyBlocks = {};
        if (result.data.listCalendarEvents.items) {
          result.data.listCalendarEvents.items.forEach(item => {
            const itemHourlyBlocks = JSON.parse(item.hourlyBlocks);
            Object.keys(itemHourlyBlocks).forEach(day => {
              if (!aggregatedHourlyBlocks[day]) {
                aggregatedHourlyBlocks[day] = {};
              }
              Object.keys(itemHourlyBlocks[day]).forEach(hour => {
                // Assuming 1 is the value for a blocked hour and 0 for free
                aggregatedHourlyBlocks[day][hour] = aggregatedHourlyBlocks[day][hour] || itemHourlyBlocks[day][hour];
              });
            });
          });
          setHourlyBlocks(aggregatedHourlyBlocks);
        }
      } catch (error) {
        console.error('Could not fetch calendar data:', error);
      }
      setShouldFetchData(false);  // Reset the flag
    };

    fetchData();
  }, [shouldFetchData]);

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
        uuid: uuid,
        hourlyBlocks: JSON.stringify(newHourlyBlocks),
      };
      const result = await API.graphql(graphqlOperation(createCalendarEvent, { input }));  // Changed this line
      console.log('Successfully created in DynamoDB:', result);
    } catch (error) {
      console.error('Could not create in DynamoDB:', error);
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
      <button onClick={deleteAllEvents}>Delete All Events</button>
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
