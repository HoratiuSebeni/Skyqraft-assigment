import { React, useState, useEffect } from 'react';
import './App.css';
import axios from "axios";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './app/home/page.js';

function App() {
  const fetchData = async () => {
    try {
      const response = await axios({
        method: 'post',
        url: 'http://127.0.0.1:5000/new_connection',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Check if the response indicates success
      if (response.status === 200) {
        // Handle the response data here
        console.log(response.data);

        // Redirect only if needed
        const url = '/home';
        if (window.location.pathname !== url) {
          window.location.href = url;
        }
      } else {
        // Handle non-successful response
        console.error('Error fetching data:', response.status, response.statusText);
      }
    } catch (error) {
      // Handle errors here
      console.error('Error fetching data:', error);
    }
  };

  fetchData();

  return (
      <Router>
        <Routes>
          <Route path="/home" element={<Home/>} />
        </Routes>
      </Router>
  );
}

export default App;

