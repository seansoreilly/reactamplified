/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTodo = /* GraphQL */ `
  query GetTodo($id: ID!) {
    getTodo(id: $id) {
      id
      name
      description
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listTodos = /* GraphQL */ `
  query ListTodos(
    $filter: ModelTodoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getCalendarEvent = /* GraphQL */ `
  query GetCalendarEvent($id: ID!) {
    getCalendarEvent(id: $id) {
      uuid
      hourlyBlocks
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listCalendarEvents = /* GraphQL */ `
  query ListCalendarEvents(
    $filter: ModelCalendarEventFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCalendarEvents(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        uuid
        hourlyBlocks
        id
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
