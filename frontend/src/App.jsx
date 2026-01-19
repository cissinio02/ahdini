import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Login from './pages/LoginClient/LoginClient';
import Register from './pages/RegisterClient/RegisterClient';
import Forgot from './pages/Forgot/Forgot';
import Terms from './pages/terms/terms';
import Home from './pages/Home/home';
import RegisterVendor from './pages/RegisterVendor/RegisterVendor';
import ToastPro from './components/UI/ToastPro';


 
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
                <Route path="/register-vendor" element={<RegisterVendor />} />

                <Route path="*" element={<Navigate to="/home" replace />} />
              </Routes>
            </div>
        </Router>
    
    
    );
}

export default App; 