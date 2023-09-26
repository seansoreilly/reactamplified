import React, { useState, useEffect, useCallback } from 'react';
import './Calendar.css';
import { API, graphqlOperation } from 'aws-amplify';
import { createCalendarEvent } from './graphql/mutations';
import { listCalendarEvents } from './graphql/queries';
import { deleteAllEvents } from './utils';

const Calendar = ({ uuid = "c359c11f-0593-4f0f-92c1-7f93d9783bd5" }) => {
  const [hourlyBlocks, setHourlyBlocks] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState(null);
  const [shouldFetchData, setShouldFetchData] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const result = await API.graphql(graphqlOperation(listCalendarEvents));
      const { items } = result.data.listCalendarEvents;
      const aggregatedHourlyBlocks = {};
      items.forEach(item => {
        const itemHourlyBlocks = JSON.parse(item.hourlyBlocks);
        Object.keys(itemHourlyBlocks).forEach(day => {
          aggregatedHourlyBlocks[day] ??= {};
          Object.keys(itemHourlyBlocks[day]).forEach(hour => {
            // Assuming 1 is the value for a blocked hour and 0 for free
            aggregatedHourlyBlocks[day][hour] ??= itemHourlyBlocks[day][hour];
          });
        });
      });
      setHourlyBlocks(aggregatedHourlyBlocks);
    } catch (error) {
      console.error('Could not fetch calendar data:', error);
    }
    setShouldFetchData(false);  // Reset the flag
  }, []);

  useEffect(() => {
    if (shouldFetchData) {
      fetchData();
    }
  }, [shouldFetchData, fetchData]);

  const handleMouseDown = useCallback(async (day, hour) => {
    setIsDragging(true);
    const newHourlyBlocks = { ...hourlyBlocks };
    const dayData = newHourlyBlocks[day] ?? {};
    dayData[hour] = !dayData[hour];
    newHourlyBlocks[day] = dayData;
    setHourlyBlocks(newHourlyBlocks);
    setDragValue(!dayData[hour]);

    try {
      const input = {
        uuid: uuid,
        hourlyBlocks: JSON.stringify(newHourlyBlocks),
      };
      const result = await API.graphql(graphqlOperation(createCalendarEvent, { input }));
      console.log('Successfully created in DynamoDB:', result);
    } catch (error) {
      console.error('Could not create in DynamoDB:', error);
    }
  }, [hourlyBlocks, uuid]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseEnter = useCallback((day, hour) => {
    if (isDragging) {
      const newHourlyBlocks = { ...hourlyBlocks };
      const dayData = newHourlyBlocks[day] ?? {};
      dayData[hour] = dragValue;
      newHourlyBlocks[day] = dayData;
      setHourlyBlocks(newHourlyBlocks);
    }
  }, [hourlyBlocks, isDragging, dragValue]);

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const hours = useState(Array.from({ length: 24 }, (_, i) => i))[0];

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
          <div className="calendar-cell" key={`hour-${hour}`}>{`${hour}:00`}</div>
          {days.map(day => (
            <div
              key={`${day}-${hour}`}
              className={`calendar-cell ${hourlyBlocks[day]?.[hour] ? 'selected' : ''}`}
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