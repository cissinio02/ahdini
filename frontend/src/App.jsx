import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Login from './pages/LoginClient/LoginClient';
import Register from './pages/RegisterClient/RegisterClient';
import Forgot from './pages/Forgot/Forgot';
import Terms from './pages/terms/terms';
import Home from './pages/Home/Home';
import ToastPro from './components/UI/ToastPro';
import HowItWorks from './pages/HowItWorks/HowItWorks';
import RegisterVendor from './pages/RegisterVendor/RegisterVendor';
import Gifts from './pages/Gifts/Gifts';
import Gift from './pages/Gift/Gift'; 


 
function App() {
    return (
    
        <Router>
            <div className="App">
              <ToastPro />
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot" element={<Forgot />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/register-vendor" element={<RegisterVendor />} />
                <Route path="/gifts" element={<Gifts />} />
                <Route path="/gift/:id" element={<Gift />} />
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/registervendor" element={< RegisterVendor/>} />
                <Route path="*" element={<Navigate to="/home" replace />} />
              </Routes>
            </div>
        </Router>
    
    
    );
}

export default App;