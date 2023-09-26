/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTodo = /* GraphQL */ `
  mutation CreateTodo(
    $input: CreateTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    createTodo(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateTodo = /* GraphQL */ `
  mutation UpdateTodo(
    $input: UpdateTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    updateTodo(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteTodo = /* GraphQL */ `
  mutation DeleteTodo(
    $input: DeleteTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    deleteTodo(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createCalendarEvent = /* GraphQL */ `
  mutation CreateCalendarEvent(
    $input: CreateCalendarEventInput!
    $condition: ModelCalendarEventConditionInput
  ) {
    createCalendarEvent(input: $input, condition: $condition) {
      uuid
      hourlyBlocks
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateCalendarEvent = /* GraphQL */ `
  mutation UpdateCalendarEvent(
    $input: UpdateCalendarEventInput!
    $condition: ModelCalendarEventConditionInput
  ) {
    updateCalendarEvent(input: $input, condition: $condition) {
      uuid
      hourlyBlocks
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteCalendarEvent = /* GraphQL */ `
  mutation DeleteCalendarEvent(
    $input: DeleteCalendarEventInput!
    $condition: ModelCalendarEventConditionInput
  ) {
    deleteCalendarEvent(input: $input, condition: $condition) {
      uuid
      hourlyBlocks
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
