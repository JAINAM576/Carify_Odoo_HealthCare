import React from 'react';
//routing...
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Link
} from 'react-router-dom';

//pages
import AppLayout from './AppLayout/AppLayout';
import Error_404 from './Pages/Error/Error_404/Error_404';
import Error_500 from './Pages/Error/Error_500/Error_500';
import Home from './Pages/App/Home/Home';
import PHQ9Assessment from './Pages/App/PHQ9Assessment';
//css files
import './main.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Login from "./Pages/App/Login/Login";
import Signup from './Pages/App/Signup/Signup';
import Chatbot from './Pages/App/Chatbot/Chatbot';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import ReportAnalysis from './Pages/App/Report-analysis/reportAnalysis';
import Profle from './Pages/App/Profile/Profile'
import Schedule from './Pages/App/Schedule/Schecule';
import Dashboard from './Pages/App/Dashboard/Dashboard';
import Booking from './Pages/App/Booking/Booking';
import DoctorProfile from './Pages/App/DoctorProfile/DocProfile';
// router and routes
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error_500 />,

    children: [
      {
        path: "/",
        index: true,
        element: <Home />,
       
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/mental-test",
        element: <PHQ9Assessment />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
       
      {
        path: "/chatbot",
        element: <Chatbot />,
      },
      {
        path: "/report-analysis",
        element: <ReportAnalysis />,
      },
      {
        path: "/profile/patient",
        element: <Profle />,
      },
      {
        path: "/schedule",
        element: <Schedule />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/booking",
        element: <Booking />,
      },
      {
        path: "/profile/doctor",
        element: <DoctorProfile />,
      },
      {
        path: "*",
        element: <Error_404 />
      },
    ]
  }
]
);

function App() {
  return (
    <RouterProvider router={router} />
  )
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

