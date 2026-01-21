import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Forgot from './pages/Forgot/Forgot';
import Terms from './pages/terms/terms';
import Home from './pages/Home/Home';
import HowItWorks from './pages/HowItWorks/HowItWorks';
import ToastPro from './components/UI/ToastPro';

 
function App() {
    return (
    
        <Router>
            <div className="App">
              <ToastPro />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot" element={<Forgot />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
        </Router>
    
    
    );
}

export default App; 