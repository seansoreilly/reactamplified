import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import "./style/Calendar.css";
import { Button, Card, useTheme, SelectField } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { API, graphqlOperation } from "aws-amplify";
import { createCalendarEvent } from "./graphql/mutations";
import { listCalendarEvents } from "./graphql/queries";
import { deleteAllEvents } from "./utils/deleteUtils";
import ColorPicker from "./ui-components/ColorPicker";

const Calendar = () => {
  const { uuid } = useParams();
  const [hourlyBlocks, setHourlyBlocks] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState(null);
  const [shouldFetchData, setShouldFetchData] = useState(false);
  const [selectfieldedColor, setSelectFieldedColor] = useState("#FF5733"); // Default color
  const theme = useTheme(); // <-- Add this line
  const handleColorChange = (e) => {
    setSelectFieldedColor(e.target.value);
  };
  const [startTime, setStartTime] = useState(0); // <-- Add this state
  const [endTime, setEndTime] = useState(23); // <-- Add this state

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
        currentBlock = {
          selectfielded: currentBlock,
          color: selectfieldedColor,
        };
      }

      // Toggle selectfielded state and set color
      currentBlock.selectfielded = !currentBlock.selectfielded;
      currentBlock.color = selectfieldedColor;

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
    [hourlyBlocks, uuid, selectfieldedColor]
  ); // Note: added selectfieldedColor dependency

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
        <ColorPicker
          color={selectfieldedColor}
          onColorChange={handleColorChange}
        />

        {/* Add these lines to show the dropdowns for start and end times */}
        <SelectField
          placeholder="Start Time"
          onChange={(e) => setStartTime(e.target.value)}
          defaultValue={startTime}
        >
          {hours.map((hour) => (
            <option key={hour} value={hour}>
              {`${hour}:00`}
            </option>
          ))}
        </SelectField>

        <SelectField
          placeholder="End Time"
          onChange={(e) => setEndTime(e.target.value)}
          defaultValue={endTime}
        >
          {hours.map((hour) => (
            <option key={hour} value={hour}>
              {`${hour}:00`}
            </option>
          ))}
        </SelectField>

        <div className="calendar-row header">
          <div className="calendar-cell"></div>
          {days.map((day) => (
            <div key={day} className="calendar-cell">
              {day}
            </div>
          ))}
        </div>
        {hours.map((hour) =>
          hour >= startTime && hour <= endTime ? (
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
                      block.selectfielded ? "selectfielded" : ""
                    }`}
                    style={{
                      backgroundColor: block.selectfielded
                        ? block.color
                        : theme?.colors?.background?.primary?.value || "",
                      borderRadius: theme?.borderRadius?.default?.value || "",
                      fontSize: theme?.fontSizes?.body?.value || "",
                      fontWeight: theme?.fontWeights?.regular?.value || "",
                    }}
                    onMouseDown={() => handleMouseDown(day, hour)}
                    onMouseEnter={() => handleMouseEnter(day, hour)}
                  ></div>
                );
              })}
            </div>
          ) : null
        )}
      </Card>
    </div>
  );
};

export default Calendar;
