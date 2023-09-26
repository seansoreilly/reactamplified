import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
// import AWS from 'aws-sdk';

Amplify.configure(awsExports);

// Override settings for local development
// if (process.env.NODE_ENV === 'development') {
//   AWS.config.update({
//     region: 'local',
//     endpoint: 'http://localhost:8000',  // Replace with your local DynamoDB endpoint
//   });

//   Amplify.configure({
//     API: {
//       graphql_endpoint: 'http://192.168.1.6:20002/graphql',
//       graphql_headers: async () => ({
//         'X-Api-Key': 'da2-fakeApiId123456',
//       }),
//     },
//     aws_dynamodb_all_tables_region: 'local',
//     aws_dynamodb_table_schemas: [
//       {
//         tableName: 'calendar-dev',
//         region: 'local',
//       },
//     ],
//   });
// }


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
