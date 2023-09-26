/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateTodo = /* GraphQL */ `
  subscription OnCreateTodo($filter: ModelSubscriptionTodoFilterInput) {
    onCreateTodo(filter: $filter) {
      id
      name
      description
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateTodo = /* GraphQL */ `
  subscription OnUpdateTodo($filter: ModelSubscriptionTodoFilterInput) {
    onUpdateTodo(filter: $filter) {
      id
      name
      description
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteTodo = /* GraphQL */ `
  subscription OnDeleteTodo($filter: ModelSubscriptionTodoFilterInput) {
    onDeleteTodo(filter: $filter) {
      id
      name
      description
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateCalendarEvent = /* GraphQL */ `
  subscription OnCreateCalendarEvent(
    $filter: ModelSubscriptionCalendarEventFilterInput
  ) {
    onCreateCalendarEvent(filter: $filter) {
      uuid
      hourlyBlocks
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateCalendarEvent = /* GraphQL */ `
  subscription OnUpdateCalendarEvent(
    $filter: ModelSubscriptionCalendarEventFilterInput
  ) {
    onUpdateCalendarEvent(filter: $filter) {
      uuid
      hourlyBlocks
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteCalendarEvent = /* GraphQL */ `
  subscription OnDeleteCalendarEvent(
    $filter: ModelSubscriptionCalendarEventFilterInput
  ) {
    onDeleteCalendarEvent(filter: $filter) {
      uuid
      hourlyBlocks
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
