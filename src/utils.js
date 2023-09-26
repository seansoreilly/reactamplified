// import { v4 as uuidv4 } from 'uuid';
import './Calendar.css';
import { API, graphqlOperation } from 'aws-amplify';
// import { getCalendarEvent } from './graphql/queries';
import { listCalendarEvents } from './graphql/queries';
import { deleteCalendarEvent } from './graphql/mutations';

export const deleteAllEvents = async () => {
    try {
      // Fetch all calendar events
      const result = await API.graphql(graphqlOperation(listCalendarEvents));
      
      if (result.data.listCalendarEvents.items) {
        // Loop through each item and delete it
        for (const item of result.data.listCalendarEvents.items) {
          const input = {
            id: item.id,
          };
          await API.graphql(graphqlOperation(deleteCalendarEvent, { input }));
        }
        console.log('Successfully deleted all events.');
      }
    } catch (error) {
      console.error('Could not delete all events:', error);
    }
  };