import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// Dodajemy "../" aby wyjść z folderu components
import LoginPage from "../pages/login/LoginPage";
import RegisterPage from "../pages/register/RegisterPage";
import "../App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Domyślnie przekieruj na stronę logowania */}
          <Route path="/" element={<Navigate to="/login" />} />
          
          {/* Ścieżki do Twoich stron */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Miejsce na przyszły Dashboard / Stronę główną */}
          <Route path="/dashboard" element={<div>Zalogowano pomyślnie!</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;