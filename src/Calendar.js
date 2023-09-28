import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import "./Calendar.css";
import { Button } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { API, graphqlOperation } from "aws-amplify";
import { createCalendarEvent } from "./graphql/mutations";
import { listCalendarEvents } from "./graphql/queries";
import { deleteAllEvents } from "./utils";
import { Card, useTheme } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

const Calendar = () => {
  const { uuid } = useParams();
  const [hourlyBlocks, setHourlyBlocks] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState(null);
  const [shouldFetchData, setShouldFetchData] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#FF5733"); // Default color
  const theme = useTheme(); // <-- Add this line
  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
  };

  const fetchData = useCallback(async () => {
    try {
      const result = await API.graphql(
        graphqlOperation(listCalendarEvents, {
          filter: {
            uuid: {
              eq: uuid,
            },
          },
        })
      );
      const { items } = result.data.listCalendarEvents;
      const aggregatedHourlyBlocks = {};
      items.forEach((item) => {
        const itemHourlyBlocks = JSON.parse(item.hourlyBlocks);
        Object.keys(itemHourlyBlocks).forEach((day) => {
          aggregatedHourlyBlocks[day] ??= {};
          Object.keys(itemHourlyBlocks[day]).forEach((hour) => {
            aggregatedHourlyBlocks[day][hour] ??= itemHourlyBlocks[day][hour];
          });
        });
      });
      setHourlyBlocks(aggregatedHourlyBlocks);
    } catch (error) {
      console.error("Could not fetch calendar data:", error);
    }
    setShouldFetchData(false); // Reset the flag
  }, [uuid]);

  useEffect(() => {
    fetchData();
  }, [shouldFetchData, fetchData]);

  const handleMouseDown = useCallback(
    async (day, hour) => {
      setIsDragging(true);
      const newHourlyBlocks = { ...hourlyBlocks };
      const dayData = newHourlyBlocks[day] ?? {};
      let currentBlock = dayData[hour] ?? {};

      // If it's a boolean, convert it to an object
      if (typeof currentBlock === "boolean") {
        currentBlock = { selected: currentBlock, color: selectedColor };
      }

      // Toggle selected state and set color
      currentBlock.selected = !currentBlock.selected;
      currentBlock.color = selectedColor;

      dayData[hour] = currentBlock;
      newHourlyBlocks[day] = dayData;
      setHourlyBlocks(newHourlyBlocks);
      setDragValue(currentBlock);

      try {
        const input = {
          uuid: uuid,
          hourlyBlocks: JSON.stringify(newHourlyBlocks),
        };
        const result = await API.graphql(
          graphqlOperation(createCalendarEvent, { input })
        );
        console.log("Successfully created in DynamoDB:", result);
      } catch (error) {
        console.error("Could not create in DynamoDB:", error);
      }
    },
    [hourlyBlocks, uuid, selectedColor]
  ); // Note: added selectedColor dependency

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseEnter = useCallback(
    (day, hour) => {
      if (isDragging) {
        const newHourlyBlocks = { ...hourlyBlocks };
        const dayData = newHourlyBlocks[day] ?? {};
        dayData[hour] = dragValue;
        newHourlyBlocks[day] = dayData;
        setHourlyBlocks(newHourlyBlocks);
      }
    },
    [hourlyBlocks, isDragging, dragValue]
  );

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const hours = useState(Array.from({ length: 24 }, (_, i) => i))[0];

  return (
    <div className="calendar" onMouseUp={handleMouseUp}>
      <Card>
        <Button onClick={() => setShouldFetchData(true)}>Fetch Data</Button>
        <Button onClick={() => deleteAllEvents(String(uuid))}>
          Delete All Events
        </Button>
        <input
          type="color"
          value={selectedColor}
          onChange={handleColorChange}
        />
        <div className="calendar-row header">
          <div className="calendar-cell"></div>
          {days.map((day) => (
            <div key={day} className="calendar-cell">
              {day}
            </div>
          ))}
        </div>
        {hours.map((hour) => (
          <div key={hour} className="calendar-row">
            {/* Add this line to show the times in the left column */}
            <div
              className="calendar-cell"
              key={`hour-${hour}`}
            >{`${hour}:00`}</div>

            {days.map((day) => {
              const block = hourlyBlocks[day]?.[hour] ?? {};
              return (
                <div
                  key={`${day}-${hour}`}
                  className={`calendar-cell ${
                    block.selected ? "selected" : ""
                  }`}
                  style={{
                    backgroundColor: block.selected
                      ? block.color
                      : (theme?.colors?.background?.primary?.value || ''),
                    borderRadius: theme?.borderRadius?.default?.value || '',
                    fontSize: theme?.fontSizes?.body?.value || '',
                    fontWeight: theme?.fontWeights?.regular?.value || '',
                  }}
                  onMouseDown={() => handleMouseDown(day, hour)}
                  onMouseEnter={() => handleMouseEnter(day, hour)}
                ></div>
              );
            })}
          </div>
        ))}
      </Card>
    </div>
  );
};

export default Calendar;
