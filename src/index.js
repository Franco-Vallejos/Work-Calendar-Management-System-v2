import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './routes/App.js';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Login from './routes/Login.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import {AuthProvider} from "./auth/AuthProvider.jsx"

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Login/>
    },
    {
      path: "/",
      element: <ProtectedRoute/>,
      children: [
        {
          path: "/loged",
          element: <App/>
        }
      ]
    },
  ]
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router = {router}/>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
