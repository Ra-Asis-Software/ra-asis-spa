import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import Register from './components/Register';
import VerifyEmail from './components/VerifyEmail';
import Login from './components/Login';
import ResetPassword from './components/ResetPassword';
import Dashboard from './components/Dashboard';

const App = () => {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/verify-email/:token' element={ <VerifyEmail /> } />
          <Route path='/login' element={ <Login /> } />
          <Route path='/reset-password' element={ <ResetPassword /> } />
          <Route path='/dashboard' element={ <Dashboard /> } />
        </Routes>
      </div>
    </Router>
  );
}

const Home = () => {

  return(
    <>
      <Header />
      <div className='home-introduction'>
        <h1>Why Hustle ? Forget About Tiresome Manual Academic Progress Analysis. Ra'Asis SPA Does It For You!</h1>
        <Link to='/register'>Sign Up Now</Link>
      </div>
    </>
  );
}

export default App;
