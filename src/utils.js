// utils.js
import { API, graphqlOperation } from 'aws-amplify';
import { listCalendarEvents } from './graphql/queries';
import { deleteCalendarEvent } from './graphql/mutations';

export const deleteAllEvents = async (uuid) => {
  try {
    // Fetch all calendar events that match the given UUID
    const result = await API.graphql(graphqlOperation(listCalendarEvents, {
      filter: {
        uuid: {
          eq: uuid  // Only fetch events that match the given UUID
        }
      }
    }));
    
    const { items } = result.data.listCalendarEvents;
    if (items.length > 0) {
      // Loop through each item and delete it
      for (const item of items) {
        const input = {
          id: item.id,
        };
        await API.graphql(graphqlOperation(deleteCalendarEvent, { input }));
      }
      console.log(`Successfully deleted all events for UUID: ${uuid}.`);
    } else {
      console.log(`No events found for UUID: ${uuid}.`);
    }
  } catch (error) {
    console.error(`Could not delete events for UUID: ${uuid}. Error:`, error);
  }
};
