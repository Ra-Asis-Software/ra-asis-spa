import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Register from "./components/Register";
import VerifyEmail from "./components/VerifyEmail";
import Login from "./components/Login";
import ResetPassword from "./components/ResetPassword";
import UpdatePassword from "./components/UpdatePassword";
import Dashboard from "./components/Dashboard";
import Introduction from "./components/Introduction";
import Footer from "./components/Footer";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email/:token" element={ <VerifyEmail /> } />
          <Route path="/login" element={ <Login /> } />
          <Route path="/reset-password" element={ <ResetPassword /> } />
          <Route path="/reset-password/:token" element={<UpdatePassword />} />
          <Route path="/dashboard" element={ <Dashboard /> } />
        </Routes>
      </div>
    </Router>
  );
}

const Home = () => {

  return(
    <>
      <Header />
      <Introduction />
      <Footer />
    </>
  );
}

export default App;
