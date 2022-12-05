import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login } from './views/LoginPage';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <Routes>

        <Route element={<App />} path="/" />
        <Route element={<Login />} path="/login" />

      </Routes>
    </Router>
  </React.StrictMode>
)
